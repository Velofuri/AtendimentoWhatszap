import mysql from 'mysql2';
import { logError } from '../log/log.js';

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'backup_atendimento',
});

connection.connect((error) => {
  if (error) {
    logError(error, 'Falha na conexão com o banco de dados ');
    console.error('Falha na conexão com o banco de dados \n' + error);
  } else {
    console.log('Conetado com sucesso ao banco de dados');
  }
});

export default connection;
