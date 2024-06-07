import { getToken } from './getToken.js'
import { logError, logSistema } from '../log/log.js'
import { salvarAudio, salvarImagem, salvarVideo } from './salvarArquivos.js'
import { v4 as uuidv4 } from 'uuid'
import { inserTableAW0, updateTableAW0 } from '../model/consultaDB.js'
import cliProgress from 'cli-progress'

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
    )
    const historico = await response.json()
    return historico
  }

  static async buscarProtocolosPorData(token) {
    let allProtocolos = []
    let pagination = 1
    let totalPagination = 1

    const progressBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic)
    progressBar.start(229, 0)

    while (pagination <= totalPagination) {
      const response = await fetch(
        `https://api.sac.digital/v2/client/protocol/all?p=${pagination}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: token,
          },
        }
      )
      const protocolos = await response.json()

      if (!protocolos.status) {
        break
      }

      allProtocolos = allProtocolos.concat(protocolos.list)
      totalPagination = Math.ceil(protocolos.total / 100)
      pagination++
      progressBar.update(pagination)
    }
    progressBar.stop()
    return allProtocolos
  }

  static async salvarHistoricoPorData() {
    try {
      const token = await getToken()

      const protocolos = await HistoricoAtendimento.buscarProtocolosPorData(token)

      const todosProtocolos = protocolos.map((itens) => itens.protocol)
      const nomeContato = protocolos.map((itens) => itens.contact.name)
      const numeroContato = protocolos.map((itens) => itens.contact.number)
      const dataAtendimento = protocolos.map((itens) => itens.opened_at)

      let historicosSalvos = []
      let mensagensSalvas = []
      let index = 0
      let progressBarIndex = 0
      console.log('Salvando protocolos no banco de dados...')
      const progressBar = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
      )
      progressBar.start(protocolos.length, 0)

      for (const numeroProtocolo of todosProtocolos) {
        progressBarIndex++
        progressBar.update(progressBarIndex)
        const historicoPorProtocolo = {
          protocolo: numeroProtocolo,
          data: dataAtendimento[index],
          nome_contato: nomeContato[index],
          numero_contato: numeroContato[index],
        }
        historicosSalvos.push(historicoPorProtocolo)
        index++
      }
      progressBar.stop()
      await inserTableAW0(historicosSalvos)

      console.log('iniciando Upload dos arquivos...')
      let progressBarIndex1 = 0
      const progressBar1 = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
      )
      progressBar1.start(protocolos.length, 0)

      for (const numeroProtocolo of todosProtocolos) {
        progressBarIndex1++
        progressBar1.update(progressBarIndex1)
        const backupPorProtocolo = await HistoricoAtendimento.buscarHistoricoDeMensagem(
          numeroProtocolo,
          token
        )
        const textoDaMensagem = await Promise.all(
          backupPorProtocolo.historic.map(async (item) => {
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
            }
          })
        )
        const mensagemPorProtocolo = {
          protocolo: numeroProtocolo,
          mensagens: textoDaMensagem,
        }
        mensagensSalvas.push(mensagemPorProtocolo)
      }
      progressBar1.stop()

      await updateTableAW0(mensagensSalvas)

      logSistema(`Protocolos salvos no banco de dados: `)
      return { success: true, message: 'Dados salvos no banco de dados.' }
    } catch (error) {
      logError(error)
      return { success: false, message: error.message }
    }
  }
}

export default HistoricoAtendimento
