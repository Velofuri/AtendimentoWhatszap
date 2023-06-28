import axios from 'axios';
import fs from 'fs';
import path from 'path';
import url from 'url';
import AWS from 'aws-sdk';
import 'dotenv/config';

const accessKeyId = process.env.S3_ACCESSKEYID;
const secretAccessKey = process.env.S3_SECRETACCESSKEY;
const region = process.env.S3_REGION;

const s3 = new AWS.S3({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region,
});

export async function salvarImagem(linkArquivo, nomeArquivo) {
  const linkLogoLacteus =
    'https://whatsapp.sac.digital/_midia/galeria/1B4893085C/imagem/1618261905_02dcab75f28b26b0ba33a148a1f75305.jpg';
  if (!linkArquivo || linkArquivo == linkLogoLacteus) {
    return null;
  } else {
    try {
      const response = await axios({
        url: linkArquivo,
        responseType: 'stream',
      });

      const params = {
        Bucket: 'velofuri-atendimento',
        Key: nomeArquivo,
        Body: response.data,
      };

      const { Location } = await s3.upload(params).promise();
      console.log('Upload do arquivo concluído:', Location);
      return Location;
    } catch (error) {
      console.error('Erro ao buscar ou enviar o arquivo:', error);
    }
  }
}

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function salvarImagem2(link, nomeDoArquivo) {
  const linkLogoLacteus =
    'https://whatsapp.sac.digital/_midia/galeria/1B4893085C/imagem/1618261905_02dcab75f28b26b0ba33a148a1f75305.jpg';
  if (!link || link == linkLogoLacteus) {
    return null;
  } else {
    try {
      const response = await axios.get(link, { responseType: 'stream' });
      const diretorio = path.join(__dirname, '..', 'downloads', 'imagens');
      if (!fs.existsSync(diretorio)) {
        fs.mkdirSync(diretorio, { recursive: true });
      }
      let novoNomeDoArquivo = nomeDoArquivo;
      let caminhoImagem = path.join(diretorio, `${novoNomeDoArquivo}.jpg`);
      let contador = 1;

      while (fs.existsSync(caminhoImagem)) {
        const extensao = path.extname(caminhoImagem);
        const nomeBase = path.basename(caminhoImagem, extensao);
        novoNomeDoArquivo = `${nomeBase}${contador}${extensao}`;
        caminhoImagem = path.join(diretorio, `${novoNomeDoArquivo}`);
        contador++;
      }

      const writer = fs.createWriteStream(caminhoImagem);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          resolve(caminhoImagem);
        });

        writer.on('error', (err) => {
          console.error(err);
          reject(err.message);
        });
      });
    } catch (error) {
      console.error(error.message);
    }
  }
}

export async function salvarVideo(link, nomeDoArquivo) {
  if (!link) {
    return null;
  } else {
    try {
      const response = await axios.get(link, { responseType: 'stream' });
      const diretorio = path.join(__dirname, '..', 'downloads', 'video');
      if (!fs.existsSync(diretorio)) {
        fs.mkdirSync(diretorio, { recursive: true });
      }
      let novoNomeDoArquivo = nomeDoArquivo;
      let caminhoImagem = path.join(diretorio, `${novoNomeDoArquivo}.mp4`);
      let contador = 1;

      while (fs.existsSync(caminhoImagem)) {
        const extensao = path.extname(caminhoImagem);
        const nomeBase = path.basename(caminhoImagem, extensao);
        novoNomeDoArquivo = `${nomeBase}${contador}${extensao}`;
        caminhoImagem = path.join(diretorio, `${novoNomeDoArquivo}`);
        contador++;
      }

      const writer = fs.createWriteStream(caminhoImagem);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          resolve(caminhoImagem);
        });

        writer.on('error', (err) => {
          console.error(err);
          reject(err.message);
        });
      });
    } catch (error) {
      console.error(error.message);
    }
  }
}

export async function salvarAudio(link, nomeDoArquivo) {
  if (!link) {
    return null;
  } else {
    try {
      const response = await axios.get(link, { responseType: 'stream' });
      const diretorio = path.join(__dirname, '..', 'downloads', 'audio');
      if (!fs.existsSync(diretorio)) {
        fs.mkdirSync(diretorio, { recursive: true });
      }
      let novoNomeDoArquivo = nomeDoArquivo;
      let caminhoImagem = path.join(diretorio, `${novoNomeDoArquivo}.mp3`);
      let contador = 1;

      while (fs.existsSync(caminhoImagem)) {
        const extensao = path.extname(caminhoImagem);
        const nomeBase = path.basename(caminhoImagem, extensao);
        novoNomeDoArquivo = `${nomeBase}${contador}${extensao}`;
        caminhoImagem = path.join(diretorio, `${novoNomeDoArquivo}`);
        contador++;
      }

      const writer = fs.createWriteStream(caminhoImagem);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          resolve(caminhoImagem);
        });

        writer.on('error', (err) => {
          console.error(err);
          reject(err.message);
        });
      });
    } catch (error) {
      console.error(error.message);
    }
  }
}
