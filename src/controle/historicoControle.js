import Historico from '../servicos/Historico.js';

class HistoricoControler {
  static buscaHistorico = async (req, res) => {
    try {
      const { data_inicial, data_final } = req.query;
      const registro = await Historico.salvaHistoricoPorData(data_inicial, data_final);
      res.json(registro);
    } catch (error) {
      res.send(error.message);
    }
  };
}

export default HistoricoControler;
