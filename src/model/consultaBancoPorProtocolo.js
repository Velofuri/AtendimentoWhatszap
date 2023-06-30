import connection from './db.js';

export async function consultaBancoPorProtocolo(protocolo) {
  try {
    const query = `SELECT * FROM AW0 WHERE AW0_protocolo = '${protocolo}';`;
    const [rows, fields] = await connection.promise().execute(query);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function consultaBancoPorData(data) {
  try {
    const query = `SELECT * FROM AW0 WHERE AW0_mensagens = '${data}';`;
    const [rows, fields] = await connection.promise().execute(query);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
