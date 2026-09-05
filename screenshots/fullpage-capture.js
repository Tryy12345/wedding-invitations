const { spawn } = require('node:child_process');
const fs = require('node:fs');
const net = require('node:net');
const path = require('node:path');
const crypto = require('node:crypto');

const [url, widthArg, output] = process.argv.slice(2);
const width = Number(widthArg);
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(__dirname, `chrome-fullpage-${width}-${Date.now()}`);

class WebSocket {
  constructor(wsUrl) {
    const parsed = new URL(wsUrl);
    this.socket = net.createConnection(Number(parsed.port), parsed.hostname);
    this.buffer = Buffer.alloc(0);
    this.ready = false;
    this.messages = [];
    this.waiters = [];

    const key = crypto.randomBytes(16).toString('base64');
    this.socket.once('connect', () => {
      this.socket.write([
        `GET ${parsed.pathname}${parsed.search} HTTP/1.1`,
        `Host: ${parsed.host}`,
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Key: ${key}`,
        'Sec-WebSocket-Version: 13',
        '',
        ''
      ].join('\r\n'));
    });

    this.socket.on('data', (chunk) => this.handleData(chunk));
    this.socket.on('error', () => {});
  }

  handleData(chunk) {
    this.buffer = Buffer.concat([this.buffer, chunk]);
    if (!this.ready) {
      const headerEnd = this.buffer.indexOf('\r\n\r\n');
      if (headerEnd === -1) return;
      this.buffer = this.buffer.subarray(headerEnd + 4);
      this.ready = true;
      this.resolveOpen?.();
    }

    while (this.buffer.length >= 2) {
      const first = this.buffer[0];
      const second = this.buffer[1];
      let length = second & 0x7f;
      let offset = 2;
      if (length === 126) {
        if (this.buffer.length < 4) return;
        length = this.buffer.readUInt16BE(2);
        offset = 4;
      } else if (length === 127) {
        if (this.buffer.length < 10) return;
        length = Number(this.buffer.readBigUInt64BE(2));
        offset = 10;
      }
      const masked = Boolean(second & 0x80);
      const maskLength = masked ? 4 : 0;
      if (this.buffer.length < offset + maskLength + length) return;

      let payload = this.buffer.subarray(offset + maskLength, offset + maskLength + length);
      if (masked) {
        const mask = this.buffer.subarray(offset, offset + 4);
        payload = Buffer.from(payload.map((byte, i) => byte ^ mask[i % 4]));
      }
      this.buffer = this.buffer.subarray(offset + maskLength + length);
      if ((first & 0x0f) === 1) this.emitMessage(payload.toString('utf8'));
    }
  }

  waitOpen() {
    if (this.ready) return Promise.resolve();
    return new Promise((resolve) => { this.resolveOpen = resolve; });
  }

  emitMessage(data) {
    const waiter = this.waiters.shift();
    if (waiter) waiter({ data });
    else this.messages.push({ data });
  }

  nextMessage() {
    if (this.messages.length) return Promise.resolve(this.messages.shift());
    return new Promise((resolve) => this.waiters.push(resolve));
  }

  send(text) {
    const payload = Buffer.from(text);
    const mask = crypto.randomBytes(4);
    const header = payload.length < 126
      ? Buffer.from([0x81, 0x80 | payload.length])
      : Buffer.from([0x81, 0x80 | 126, payload.length >> 8, payload.length & 255]);
    const masked = Buffer.from(payload.map((byte, i) => byte ^ mask[i % 4]));
    this.socket.write(Buffer.concat([header, mask, masked]));
  }

  close() {
    this.socket.end();
  }
}

async function run(wsUrl, proc) {
  const ws = new WebSocket(wsUrl);
  const responses = new Map();
  const events = [];
  let id = 1;

  function send(method, params = {}, sessionId) {
    const messageId = id++;
    ws.send(JSON.stringify({ id: messageId, method, params, sessionId }));
    return new Promise((resolve, reject) => responses.set(messageId, { resolve, reject }));
  }

  ws.waitOpen();
  (async function pump() {
    while (true) {
      const event = await ws.nextMessage();
      const msg = JSON.parse(event.data);
      if (msg.id && responses.has(msg.id)) {
        const pending = responses.get(msg.id);
        responses.delete(msg.id);
        msg.error ? pending.reject(new Error(msg.error.message)) : pending.resolve(msg.result);
      } else {
        events.push(msg);
      }
    }
  })();

  await ws.waitOpen();
  const target = await send('Target.createTarget', { url: 'about:blank' });
  const attached = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });
  const sessionId = attached.sessionId;
  await send('Page.enable', {}, sessionId);
  await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width <= 430 }, sessionId);
  await send('Page.navigate', { url }, sessionId);

  await new Promise((resolve) => {
    const deadline = Date.now() + 8000;
    const tick = () => {
      if (events.some((msg) => msg.method === 'Page.loadEventFired')) return resolve();
      if (Date.now() > deadline) return resolve();
      setTimeout(tick, 50);
    };
    tick();
  });
  await new Promise((resolve) => setTimeout(resolve, 1200));

  await send('Runtime.evaluate', {
    expression: `
      document.body.classList.add('scroll-enabled');
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('in-view'));
      document.querySelectorAll('.click-overlay').forEach((el) => el.classList.add('hidden'));
      document.documentElement.style.scrollBehavior = 'auto';
    `
  }, sessionId);
  await new Promise((resolve) => setTimeout(resolve, 350));

  const metrics = await send('Page.getLayoutMetrics', {}, sessionId);
  const content = metrics.contentSize;
  await send('Emulation.setDeviceMetricsOverride', {
    width,
    height: Math.ceil(content.height),
    deviceScaleFactor: 1,
    mobile: width <= 430
  }, sessionId);
  await new Promise((resolve) => setTimeout(resolve, 300));
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: { x: 0, y: 0, width: content.width, height: content.height, scale: 1 }
  }, sessionId);

  fs.writeFileSync(output, Buffer.from(shot.data, 'base64'));
  ws.close();
  proc.kill();
}

const proc = spawn(chrome, [
  '--headless=new',
  '--disable-gpu',
  '--allow-file-access-from-files',
  '--hide-scrollbars',
  '--remote-debugging-port=0',
  `--user-data-dir=${userDataDir}`,
  'about:blank'
], { stdio: ['ignore', 'pipe', 'pipe'] });

let buffer = '';
let started = false;
function onData(chunk) {
  if (started) return;
  buffer += chunk.toString();
  const match = buffer.match(/DevTools listening on (ws:\/\/[^\s]+)/);
  if (match) {
    started = true;
    run(match[1], proc).catch((error) => {
      console.error(error);
      proc.kill();
      process.exit(1);
    });
  }
}
proc.stdout.on('data', onData);
proc.stderr.on('data', onData);
