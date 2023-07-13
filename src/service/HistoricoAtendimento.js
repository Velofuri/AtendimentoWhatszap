import { getToken } from './getToken.js';
import { logError, logSistema } from '../log/log.js';
import { salvarAudio, salvarImagem, salvarVideo } from './salvarArquivos.js';
import { v4 as uuidv4 } from 'uuid';
import { inserTableAW0, updateTableAW0} from '../model/consultaDB.js'

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

  static async buscarProtocolosPorData(dataInicial, token) {
    const response = await fetch(
      `https://api.sac.digital/v2/client/protocol/search?filter=7&start_at=${dataInicial}&finish_at=${dataInicial}`,
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

  static async salvarHistoricoPorData(dataInicial) {
    try {
      const token = await getToken();
      const protocolos = await HistoricoAtendimento.buscarProtocolosPorData(
        dataInicial,
        token
      );
      const todosProtocolos = protocolos.list.map((itens) => itens.protocol);
      const nomeContato = protocolos.list.map((itens) => itens.contact.name);
      const numeroContato = protocolos.list.map((itens) => itens.contact.number);
      const dataAtendimento = protocolos.list.map((itens) => itens.opened_at);

      let historicosSalvos = [];
      let mensagensSalvas = [];
      let index = 0;

      for (const numeroProtocolo of todosProtocolos) {
        const historicoPorProtocolo = {
          protocolo: numeroProtocolo,
          data: dataAtendimento[index],
          nome_contato: nomeContato[index],
          numero_contato: numeroContato[index],
        };
        historicosSalvos.push(historicoPorProtocolo);
        index++;
      }
      await inserTableAW0(historicosSalvos);

      for (const numeroProtocolo of todosProtocolos) {
        const backupPorProtocolo = await HistoricoAtendimento.buscarHistoricoDeMensagem(
          numeroProtocolo,
          token
        );
        const textoDaMensagem = await Promise.all(
          backupPorProtocolo.historic.map(async (item) => {
            return {
              by: item.by,
              text: item.text,
              created_at: item.created_at,
              imageSAC: item.image,
              // image: await salvarImagem(item.image, `${numeroProtocolo}-${uuidv4()}`),
              videoSAC: item.video,
              // video: await salvarVideo(item.video, `${numeroProtocolo}-${uuidv4()}`),
              audioSAC: item.audio,
              // audio: await salvarAudio(item.audio, `${numeroProtocolo}-${uuidv4()}`),
            };
          })
        );
        const mensagemPorProtocolo = {
          protocolo: numeroProtocolo,
          mensagens: textoDaMensagem,
        };
        mensagensSalvas.push(mensagemPorProtocolo);
      }

      await updateTableAW0(mensagensSalvas);

      logSistema(`Protocolos salvos no banco de dados: ${todosProtocolos} `);
      return { success: true, message: 'Dados salvos no banco de dados.' };
    } catch (error) {
      logError(error);
      return { success: false, message: error.message };
    }
  }
}

export default HistoricoAtendimento;
