import { consultaBancoPorProtocolo } from '../model/consultaBancoPorProtocolo.js';
import HistoricoAtendimento from '../service/HistoricoAtendimento.js';

class HistoricoControler {
  static salvarHistoricoAtendimento = async (req, res) => {
    try {
      const { data_inicial, data_final } = req.query;
      const registro = await HistoricoAtendimento.salvarHistoricoPorData(data_inicial, data_final);
      if (!registro.success) {
        res.status(400).json(registro);
      } else {
        res.status(201).json(registro);
      }
    } catch (error) {
      res.status(400).send(error.message);
    }
  };

  static getHistoricoPorProtocolo = async (req, res) => {
    try {
      const { protocolo } = req.params;
      const historico = await consultaBancoPorProtocolo(protocolo)
      res.json(historico);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
}

export default HistoricoControler;
