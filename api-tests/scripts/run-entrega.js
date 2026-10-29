const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
const { spawn, execFileSync } = require('node:child_process');
const { once } = require('node:events');
const root = path.resolve(__dirname, '../..');
const mongoose = require(require.resolve('mongoose', { paths: [path.join(root, 'backend')] }));
const mongoServer = new URL(process.env.TEST_MONGODB_SERVER || 'mongodb://127.0.0.1:27017');
if (mongoServer.protocol !== 'mongodb:' || !['localhost', '127.0.0.1'].includes(mongoServer.hostname) || mongoServer.username || mongoServer.password || !['', '/'].includes(mongoServer.pathname) || mongoServer.search) {
  throw new Error('TEST_MONGODB_SERVER debe indicar solamente un servidor MongoDB local, sin credenciales ni base compartida.');
}
const label = process.argv[2] || 'entrega30';
if (!/^[a-z\d_-]+$/i.test(label)) throw new Error('Etiqueta inválida');
const output = path.join(root, 'api-tests/evidencias/entrega30');
fs.mkdirSync(output, { recursive: true });
const dbName = `vt_solutions_entrega_test_${randomUUID().replaceAll('-', '')}`;
const record = { startedAt: new Date().toISOString(), dbName, port: 4001, node: process.version, mongoose: mongoose.version };
try { record.sourceRevision = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8', windowsHide: true }).trim(); } catch { record.sourceRevision = 'no disponible'; }
const log = fs.createWriteStream(path.join(output, `${label}.txt`));
let server, child;
function write(text) { process.stdout.write(text); log.write(text); }
async function main() {
  write(`Inicio ${record.startedAt}; revisión ${record.sourceRevision}; API local 4001.\n`);
  await mongoose.connect(mongoServer.href, { dbName, serverSelectionTimeoutMS: 5000 });
  await require('../../backend/src/models/User').init();
  server = require('../../backend/src/app').listen(4001, '127.0.0.1');
  await once(server, 'listening');
  child = spawn(process.execPath, [require.resolve('jest/bin/jest'), '--config', 'jest.entrega.config.cjs', '--runInBand', '--json', '--outputFile', path.join(output, `${label}.json`)], {
    cwd: path.join(root, 'api-tests'), windowsHide: true,
    env: { ...process.env, API_BASE_URL: 'http://127.0.0.1:4001', NO_PROXY: 'localhost,127.0.0.1', FORCE_COLOR: '0' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  child.stdout.on('data', chunk => write(chunk.toString()));
  child.stderr.on('data', chunk => write(chunk.toString()));
  const [code, signal] = await once(child, 'close');
  record.exitCode = code ?? 1;
  record.signal = signal;
  process.exitCode = record.exitCode;
}
main().catch(error => {
  record.infrastructureError = error.code || error.name;
  write(`Error de infraestructura (${record.infrastructureError}). Comprobar MongoDB local, dependencias y puerto 4001.\n`);
  process.exitCode = 1;
}).finally(async () => {
  try {
    if (server?.listening) await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
    if (mongoose.connection.readyState === 1) {
      if (mongoose.connection.name !== dbName || !/^vt_solutions_entrega_test_[a-f\d]{32}$/.test(dbName)) throw new Error('Base activa distinta de la creada por el ejecutor');
      record.beforeDrop = {};
      for (const collection of await mongoose.connection.db.listCollections().toArray()) record.beforeDrop[collection.name] = await mongoose.connection.db.collection(collection.name).countDocuments();
      await mongoose.connection.dropDatabase();
      record.databaseRemoved = !(await mongoose.connection.db.admin().listDatabases()).databases.some(db => db.name === dbName);
      if (!record.databaseRemoved) throw new Error('Base temporal todavía presente');
      write('Limpieza comprobada: base temporal eliminada.\n');
    }
  } catch (error) { write(`Error de limpieza: ${error.message}\n`); process.exitCode = 1; }
  finally {
    await mongoose.disconnect();
    record.finishedAt = new Date().toISOString();
    fs.writeFileSync(path.join(output, `${label}-entorno.json`), JSON.stringify(record, null, 2) + '\n');
    log.end();
  }
});
