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
        'Ocorreu um erro durante a inserção, nenhum dado foi salvo no banco de dados. Erro: ' +
          error.message
      );
    } finally {
      connection.end;
    }
  }

  static async salvaHistoricoPorData(dataInicial, dataFinal) {
    try {
      const token = await getToken();
      const protocolos = await Historico.buscarProtocolosPorData(
        dataInicial,
        dataFinal,
        token
      );
      const numeroProtocolos = protocolos.list.map((itens) => itens.protocol);
      const nomeContato = protocolos.list.map((itens) => itens.contact.name);
      const numeroContato = protocolos.list.map((itens) => itens.contact.number);

      let historicosSalvos = [];
      let index = 0;

      for (const iterator of numeroProtocolos) {
        const backupPorProtocolo = await Historico.buscarHistoricoDeMensagem(
          iterator,
          token
        );
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
      }
      await Historico.inserTableAW0(historicosSalvos);

      return { success: true, message: 'Todos os dados foram inseridos com sucesso.' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

export default Historico;
