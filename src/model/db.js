import mysql from 'mysql2';
import { logError } from '../log/log.js';
import 'dotenv/config';

const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD_DB,
  database: process.env.DATABASE,
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
