import fs from 'fs';
import path from "path";
import url from 'url'

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataAtual = new Date()
  .toLocaleDateString('pt-BR', { timeZone: 'UTC' })
  .replace(/\//g, '-');

// const caminhoArquivoLog = `./src/log/arquivosLog/app-${dataAtual}.log`;
const diretorio = path.join(__dirname, 'arquivosLog')
if (!fs.existsSync(diretorio)) {
  fs.mkdirSync(diretorio);
}
const caminhoArquivoLog = path.join(diretorio, `app-${dataAtual}.log` );

const dataHora = new Date().toLocaleString('pt-BR', { timezone: 'UTC' });

export function logRequest(req) {
  const logDados = {
    Requisição: {
      data_hora: dataHora,
      method: req.method,
      url: req.url,
      ip: req.connection.remoteAddress,
      body: req.body,
      authorization: req.headers.authorization,
    },
  };
  const logString = JSON.stringify(logDados, null, 2);
  fs.appendFileSync(caminhoArquivoLog, logString + '\n');
}

export function logError(error, msg) {
  const logDados = {
    Erro: {
      data_hora: dataHora,
      Erro: error.message,
      Mensagem: msg,
    },
  };
  const logString = JSON.stringify(logDados, null, 2);
  fs.appendFileSync(caminhoArquivoLog, logString + '\n');
}

export function logSistema(msg) {
  const logDados = {
    Success: {
      data_hora: dataHora,
      Mensagem: msg,
    },
  };
  const logString = JSON.stringify(logDados, null, 2);
  fs.appendFileSync(caminhoArquivoLog, logString + '\n');
}
