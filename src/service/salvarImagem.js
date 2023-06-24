import axios from 'axios';
import fs from 'fs';
import path from 'path';
import url from 'url';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function salvarImagem(link, nomeDoArquivo) {
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
      let novoNomeDoArquivo = nomeDoArquivo
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
