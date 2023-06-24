import mysql from "mysql2";

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root'
});

export function criarBancoDeDados() {
  connection.query('CREATE DATABASE IF NOT EXISTS backup_atendimento', (error) => {
    if (error) {
      console.error('Erro ao criar o banco de dados ', error.message);
    } else {
      console.log('Banco de dados criado com sucesso!');
      criarTabela();
    }
  });
}

export function criarTabela() {
  connection.query(
    `USE backup_atendimento;`, (error) => {
      if (error) {
        console.error('Erro ao selecionar o banco de dados: ', error.message)
      } else {
        connection.query(`CREATE TABLE IF NOT EXISTS AW0 (
          AW0_protocolo VARCHAR(15) PRIMARY KEY,
          AW0_nome_contato VARCHAR(100),
          AW0_numero_contato VARCHAR(15),
          AW0_mensagens JSON);`,
          (error) => {
            if (error) {
              console.error('Erro ao criar a tabela', error.message);
            } else {
              console.log('Tabela criada com sucesso!');
            }
            connection.end();
          })
      }
    }
    
  );
}

connection.connect((error) => {
  if (error) {
    console.error("Falha na conexão", error.message)
  } else {
    console.log('conecxão estabelecida com sucesso!')
    criarBancoDeDados();
  }
})
