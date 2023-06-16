import { getToken } from './getToken.js';
import connection from '../model/db.js';

class Historico {
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

  static async inserTableAW0(protocolo, nome_contato, numero_contato, mensagens) {
    const sql =
      'INSERT INTO aw0 (AW0_protocolo, AW0_nome_contato, AW0_numero_contato, AW0_mensagens) VALUES (?,?,?,?)';
    const values = [protocolo, nome_contato, numero_contato, mensagens];
    connection.query(sql, values, (error, results) => {
      if (error) {
        return console.log(`Erro ao salvar o protocolo ${protocolo} no banco de dados: ${error.message}`);
      }
      return console.log(`Protocolo ${protocolo} salvo no banco de dados com sucesso.`);
    });
  }

  static async salvaHistoricoPorData(dataInicial, dataFinal) {
    try {
      const token = await getToken();
      const protocolos = await Historico.buscarProtocolosPorData(dataInicial, dataFinal, token);
      const numeroProtocolos = protocolos.list.map((itens) => itens.protocol);
      const nomeContato = protocolos.list.map((itens) => itens.contact.name);
      const numeroContato = protocolos.list.map((itens) => itens.contact.number);

      let historicosSalvos = [];
      let index = 0;

      for (const iterator of numeroProtocolos) {
        const backupPorProtocolo = await Historico.buscarHistoricoDeMensagem(iterator, token);
        const textoDaMensagem = backupPorProtocolo.historic.map((item) => {
          return {
            by: item.by,
            text: item.text,
            created_at: item.created_at,
          };
        });
        const historico = {
          protocolo: iterator,
          nome_contato: nomeContato[index],
          numero_contato: numeroContato[index],
          mensagens: textoDaMensagem,
        };
        historicosSalvos.push(historico);
        index++;

        await Historico.inserTableAW0(
          historico.protocolo,
          historico.nome_contato,
          historico.numero_contato,
          JSON.stringify(historico.mensagens)
        );
      }

      return { success: true, message: 'Salvo no banco' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default Historico;
