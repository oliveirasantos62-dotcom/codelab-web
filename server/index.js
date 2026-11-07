const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 4173);
const ROOT = path.join(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const configs = {
  c: { file: 'main.c', check: 'gcc', versionArgs: ['--version'] },
  java: { file: 'Main.java', check: 'javac', versionArgs: ['-version'] },
  kotlin: { file: 'Main.kt', check: 'kotlinc', versionArgs: ['-version'] }
};
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };
function send(res, status, data, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(type.startsWith('application/json') ? JSON.stringify(data) : data);
}
function run(command, args, cwd, input = '', timeout = 10000) {
  return new Promise(resolve => {
    let stdout = '', stderr = '', finished = false;
    let child;
    try { child = spawn(command, args, { cwd, windowsHide: true, shell: false, env: process.env }); }
    catch (e) { return resolve({ code: -1, stdout, stderr: e.message, timedOut: false }); }
    const timer = setTimeout(() => { if (!finished) { finished = true; child.kill('SIGKILL'); resolve({ code: -1, stdout, stderr: stderr + '\nTempo limite excedido.', timedOut: true }); } }, timeout);
    child.stdout.on('data', d => stdout += d.toString());
    child.stderr.on('data', d => stderr += d.toString());
    child.on('error', e => { if (!finished) { finished = true; clearTimeout(timer); resolve({ code: -1, stdout, stderr: stderr + e.message, timedOut: false }); } });
    child.on('close', code => { if (!finished) { finished = true; clearTimeout(timer); resolve({ code: code ?? -1, stdout, stderr, timedOut: false }); } });
    if (input) child.stdin.write(input);
    child.stdin.end();
  });
}
async function handle(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  if (req.method === 'GET' && url.pathname === '/api/status') {
    const result = {};
    for (const [key, cfg] of Object.entries(configs)) {
      const r = await run(cfg.check, cfg.versionArgs, ROOT, '', 2500);
      result[key] = { available: r.code !== -1, version: (r.stdout + r.stderr).trim().split('\n')[0] || 'Não encontrado' };
    }
    return send(res, 200, result);
  }
  if (req.method === 'POST' && url.pathname === '/api/run') {
    let raw = '';
    for await (const chunk of req) { raw += chunk; if (raw.length > 150000) return send(res, 413, { error: 'Requisição muito grande.' }); }
    let body;
    try { body = JSON.parse(raw || '{}'); } catch { return send(res, 400, { error: 'JSON inválido.' }); }
    const { language, code, stdin = '' } = body;
    if (!configs[language]) return send(res, 400, { error: 'Linguagem inválida.' });
    if (typeof code !== 'string' || !code.trim()) return send(res, 400, { error: 'Digite algum código antes de executar.' });
    if (code.length > 100000) return send(res, 413, { error: 'Código muito grande (limite: 100 KB).' });
    const dir = path.join(os.tmpdir(), 'codelab-' + crypto.randomBytes(8).toString('hex'));
    fs.mkdirSync(dir, { recursive: true });
    const cfg = configs[language];
    fs.writeFileSync(path.join(dir, cfg.file), code, 'utf8');
    try {
      let compile = { code: 0, stdout: '', stderr: '' };
      let execution;
      if (language === 'c') {
        compile = await run('gcc', [cfg.file, '-std=c11', '-Wall', '-Wextra', '-O0', '-o', 'program'], dir, '', 15000);
        if (compile.code === 0) execution = await run(path.join(dir, process.platform === 'win32' ? 'program.exe' : 'program'), [], dir, String(stdin), 5000);
      } else if (language === 'java') {
        compile = await run('javac', [cfg.file], dir, '', 20000);
        if (compile.code === 0) execution = await run('java', ['-cp', dir, 'Main'], dir, String(stdin), 5000);
      } else {
        compile = await run('kotlinc', [cfg.file, '-include-runtime', '-d', 'program.jar'], dir, '', 30000);
        if (compile.code === 0) execution = await run('java', ['-jar', 'program.jar'], dir, String(stdin), 5000);
      }
      const result = execution || { code: compile.code, stdout: '', stderr: '' };
      return send(res, 200, { compile, run: result, success: compile.code === 0 && result.code === 0 });
    } catch (e) {
      return send(res, 500, { error: e.message });
    } finally {
      fs.rm(dir, { recursive: true, force: true }, () => {});
    }
  }
  if (req.method === 'GET') {
    const requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
    const file = path.resolve(PUBLIC, '.' + requested);
    if (!file.startsWith(PUBLIC + path.sep) && file !== path.join(PUBLIC, 'index.html')) return send(res, 403, { error: 'Acesso negado.' });
    fs.readFile(file, (err, data) => err ? send(res, 404, { error: 'Arquivo não encontrado.' }) : send(res, 200, data, mime[path.extname(file)] || 'application/octet-stream'));
    return;
  }
  send(res, 404, { error: 'Rota não encontrada.' });
}
http.createServer((req, res) => { handle(req, res).catch(e => { if (!res.headersSent) send(res, 500, { error: e.message }); }); }).listen(PORT, '127.0.0.1', () => console.log(`CodeLab Web rodando em http://localhost:${PORT}`));
