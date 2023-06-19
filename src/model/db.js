import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'atendimento'
});

connection.connect((error) => {
  if (error) {
    console.error('Falha na conexão com o banco de dados \n' + error);
  } else {
    console.log("Conetado com sucesso ao banco de dados");
  }
});

export default connection;