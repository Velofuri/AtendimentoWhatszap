import connection from "./db.js";

export async function consultaBancoPorProtocolo(protocolo) {
    try {
        const query = `SELECT * FROM AW0 WHERE AW0_protocolo = '${protocolo}';`;
        const [rows, fields] = await connection.promise().execute(query);
        console.log(rows); // Exibe os resultados da consulta
        return rows;
      } catch (error) {
          console.error(error);
          throw error;
        }
      }
      
// export function consultaBancoPorProtocolo(protocolo) {
//   return new Promise((resolve, reject) => {
//     const query = `SELECT * FROM AW0 WHERE AW0_protocolo = '${protocolo}';`;
//     connection.query(query, (error, resultado) => {
//       if (error) {
//         console.error(error);
//         reject(error);
//       } else {
//         resolve(resultado);
//       }
//     });
//   });
// }