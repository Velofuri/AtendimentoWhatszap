import mysql from 'mysql2';
import { logError } from '../log/log.js';
import 'dotenv/config';

const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD_DB;
const database = process.env.DATABASE;

const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD_DB;
const database = process.env.DATABASE;

const connection = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database,
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
