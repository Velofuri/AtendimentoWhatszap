import { consultaTableAW0 } from '../model/consultaDB.js';
import HistoricoAtendimento from '../service/HistoricoAtendimento.js';
import { logRequest, logError, logSistema } from '../log/log.js';

class HistoricoControler {
  static salvarHistoricoAtendimento = async (req, res) => {
    try {
      const { data } = req.query;
      const registro = await HistoricoAtendimento.salvarHistoricoPorData(data);
      if (!registro.success) {
        res.status(400).json(registro);
      } else {
        res.status(201).json(registro);
      }
    } catch (error) {
      logError(error, "Controller error")
      res.status(400).send(error.message);
    }
  };

  static consultaHistoricoAtendimento = async (req, res) => {
    try {
      const { protocolo, data, nome } = req.query;
      const historico = await consultaTableAW0(protocolo, data, nome);
      logRequest(req);
      res.status(200).json(historico);
    } catch (error) {
      logError(error, 'Erro ao realizar consulta do historico de atendimento');
      res.status(400).send(error.message);
    }
  };
}

export default HistoricoControler;
