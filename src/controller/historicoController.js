import { consultaTableAW0 } from '../model/consultaDB.js'
import HistoricoAtendimento from '../service/HistoricoAtendimento.js'
import { logRequest, logError, logSistema } from '../log/log.js'
import { getToken } from '../service/getToken.js'

class HistoricoControler {
  static salvarHistoricoAtendimento = async (req, res) => {
    try {
      const registro = await HistoricoAtendimento.salvarHistoricoPorData()
      if (!registro.success) {
        res.status(400).json(registro)
      } else {
        res.status(201).json(registro)
      }
    } catch (error) {
      logError(error, 'Controller error')
      res.status(400).send(error.message)
    }
  }

  static consultaHistoricoAtendimento = async (req, res) => {
    try {
      const { protocolo, data, nome } = req.query
      const historico = await consultaTableAW0(protocolo, data, nome)
      logRequest(req)
      res.status(200).json(historico)
    } catch (error) {
      logError(error, 'Erro ao realizar consulta do historico de atendimento')
      res.status(400).send(error.message)
    }
  }

  static testeFuncBuscarProtocolos = async (req, res) => {
    try {
      const token = await getToken()
      const protocolos = await HistoricoAtendimento.buscarProtocolosPorData(token)
      res.status(200).json(protocolos)
    } catch (error) {
      logError(error, 'Erro ao buscar protocolos')
      res.status(400).send(error.message)
    }
  }
}

export default HistoricoControler
