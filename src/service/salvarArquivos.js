import axios from 'axios'
import AWS from 'aws-sdk'

const s3 = new AWS.S3({
  accessKeyId: process.env.S3_ACCESSKEYID,
  secretAccessKey: process.env.S3_SECRETACCESSKEY,
  region: process.env.S3_REGION,
})

export async function salvarImagem(linkArquivo, nomeArquivo) {
  const linkLogoLacteus =
    'https://whatsapp.sac.digital/_midia/galeria/1B4893085C/imagem/1618261905_02dcab75f28b26b0ba33a148a1f75305.jpg'
  if (!linkArquivo || linkArquivo == linkLogoLacteus) {
    return null
  } else {
    try {
      const response = await axios({
        url: linkArquivo,
        responseType: 'stream',
      })

      const params = {
        Bucket: `${process.env.BUCKET_NAME}/imagens`,
        Key: `${nomeArquivo}.jpg`,
        Body: response.data,
      }

      const { Location } = await s3.upload(params).promise()
      return Location
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error)
    }
  }
}

export async function salvarVideo(linkArquivo, nomeArquivo) {
  if (!linkArquivo) {
    return null
  } else {
    try {
      const response = await axios({
        url: linkArquivo,
        responseType: 'stream',
      })

      const params = {
        Bucket: `${process.env.BUCKET_NAME}/videos`,
        Key: `${nomeArquivo}.mp4`,
        Body: response.data,
      }

      const { Location } = await s3.upload(params).promise()
      return Location
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error)
    }
  }
}

export async function salvarAudio(linkArquivo, nomeArquivo) {
  if (!linkArquivo) {
    return null
  } else {
    try {
      const response = await axios({
        url: linkArquivo,
        responseType: 'stream',
      })

      const params = {
        Bucket: `${process.env.BUCKET_NAME}/audios`,
        Key: `${nomeArquivo}.mp3`,
        Body: response.data,
      }

      const { Location } = await s3.upload(params).promise()
      return Location
    } catch (error) {
      console.error('Erro ao enviar o arquivo:', error)
    }
  }
}
