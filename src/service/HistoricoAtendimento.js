import { getToken } from './getToken.js';
import connection from '../model/db.js';
import { logError, logSistema } from '../log/log.js';
import { salvarAudio, salvarImagem, salvarVideo } from './salvarArquivos.js';
import { v4 as uuidv4 } from 'uuid';

class HistoricoAtendimento {
  static async buscarHistoricoDeMensagem(protocolo, token) {
    const response = await fetch(
      `https://api.sac.digital/v2/client/protocol/messages?protocol=${protocolo}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    const historico = await response.json();
    return historico;
  }

  static async buscarProtocolosPorData(dataInicial, dataFinal, token) {
    const response = await fetch(
      `https://api.sac.digital/v2/client/protocol/search?filter=7&start_at=${dataInicial}&finish_at=${dataFinal}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      }
    );
    const protocolos = await response.json();
    if (protocolos.status != true) {
      throw new Error(protocolos.message);
    }
    return protocolos;
  }

  static async inserTableAW0(dados) {
    try {
      await connection.promise().beginTransaction();
      for (const dado of dados) {
        const query =
          'INSERT INTO aw0 (AW0_protocolo, AW0_nome_contato, AW0_numero_contato, AW0_mensagens) VALUES (?, ?, ?, ?)';
        await connection
          .promise()
          .execute(query, [
            dado.protocolo,
            dado.nome_contato,
            dado.numero_contato,
            dado.mensagens,
          ]);
      }
      await connection.promise().commit();
      console.log('Todos os dados foram inseridos com sucesso.');
      return true;
    } catch (error) {
      await connection.promise().rollback();
      throw new Error(
        'Ocorreu um erro de inserção, verifique e tente novamente. Erro: ' + error.message
      );
    }
  }

  static async salvarHistoricoPorData(dataInicial, dataFinal) {
    try {
      const token = await getToken();
      const protocolos = await HistoricoAtendimento.buscarProtocolosPorData(
        dataInicial,
        dataFinal,
        token
      );
      const todosProtocolos = protocolos.list.map((itens) => itens.protocol);
      const nomeContato = protocolos.list.map((itens) => itens.contact.name);
      const numeroContato = protocolos.list.map((itens) => itens.contact.number);

      let historicosSalvos = [];
      let index = 0;

      for (const numeroProtocolo of todosProtocolos) {
        const backupPorProtocolo = await HistoricoAtendimento.buscarHistoricoDeMensagem(
          numeroProtocolo,
          token
        );
        const textoDaMensagem = await Promise.all(backupPorProtocolo.historic.map(async(item) => {
          return {
            by: item.by,
            text: item.text,
            created_at: item.created_at,
            imageSAC: item.image,
            image: await salvarImagem(item.image, `${numeroProtocolo}-${uuidv4()}`),
            videoSAC: item.video,
            video: await salvarVideo(item.video, `${numeroProtocolo}-${uuidv4()}`),
            audioSAC: item.audio,
            audio: await salvarAudio(item.audio, `${numeroProtocolo}-${uuidv4()}`),
          };
        }));
        const historicoPorProtocolo = {
          protocolo: numeroProtocolo,
          nome_contato: nomeContato[index],
          numero_contato: numeroContato[index],
          mensagens: textoDaMensagem,
        };
        historicosSalvos.push(historicoPorProtocolo);
        index++;
      }
      await HistoricoAtendimento.inserTableAW0(historicosSalvos);

      logSistema(`Protocolos salvos no banco de dados: ${todosProtocolos} `);
      return { success: true, message: 'Dados salvos no banco de dados.' };
    } catch (error) {
      logError(error);
      return { success: false, message: error.message };
    }
  }
}

export default HistoricoAtendimento;
