import connection from './db.js';

export async function consultaTableAW0(protocolo, data, nome) {
  try {
    let query = `SELECT * FROM AW0 WHERE 1=1 `;
    if (protocolo) {
      query += `AND AW0_protocolo = '${protocolo}'`;
    }
    if (data) {
      query += `AND AW0_data = '${data}'`;
    }
    if (nome) {
      query += `AND AW0_nome_contato LIKE '%${nome}%'`;
    }
    const [rows] = await connection.promise().execute(query);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function inserTableAW0(dados) {
  try {
    await connection.promise().beginTransaction();
    for (const dado of dados) {
      const query =
        'INSERT INTO AW0 (AW0_protocolo, AW0_data, AW0_nome_contato, AW0_numero_contato) VALUES (?, ?, ?, ?)';
      await connection
        .promise()
        .execute(query, [
          dado.protocolo,
          dado.data,
          dado.nome_contato,
          dado.numero_contato,
        ]);
    }
    await connection.promise().commit();
    console.log('Dados inseridos no banco de dados, ...aguarde upload dos arquivos.');
    return true;
  } catch (error) {
    await connection.promise().rollback();
    throw new Error(
      'Ocorreu um erro de inserção, verifique e tente novamente. Erro: ' + error.message
    );
  }
}
export async function updateTableAW0(dados) {
  try {
    await connection.promise().beginTransaction();
    for (const dado of dados) {
      const query = 'UPDATE AW0 SET AW0_mensagens = ? WHERE AW0_protocolo = ?';
      await connection.promise().execute(query, [dado.mensagens, dado.protocolo]);
    }
    await connection.promise().commit();
    console.log('Upload dos arquivos realizado com sucesso!.');
    return true;
  } catch (error) {
    await connection.promise().rollback();
    throw new Error(
      'Ocorreu um erro de inserção, Texto da mensagem. Erro: ' + error.message
    );
  }
}
