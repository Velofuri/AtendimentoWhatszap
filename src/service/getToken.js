import 'dotenv/config';

const cliente = process.env.CLIENTE;
const password = process.env.PASSWORD;

export async function getToken() {
  const response = await fetch(`https://api.sac.digital/v2/client/auth2/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client: cliente,
      password: password,
      scopes: ['protocol', 'manager'],
    }),
  });
  const token = await response.json();
  return 'Bearer ' + token.token;
}