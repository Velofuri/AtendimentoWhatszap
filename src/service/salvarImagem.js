import axios from 'axios';
import fs from 'fs';

export async function salvarImagem(link, nomeDaImagem) {
  try {
    const response = await axios.get(link, { responseType: 'stream' });
    const caminhoImagem = `src/imagens/${nomeDaImagem}.jpg`;
    const writer = fs.createWriteStream(caminhoImagem);
    response.data.pipe(writer);

    writer.on('finish', () => {
      console.log("'Imagem salva com sucesso!'");
      return caminhoImagem;
    });

    writer.on('error', (err) => {
      console.error(err);
      return 'Erro ao salvar a imagem.';
    });
  } catch (error) {
    console.error(error);
  }
}
