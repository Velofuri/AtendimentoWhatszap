import express from 'express';
import router from './src/routes/historicoRotas.js';

const app = express();
const port = 3000;

app.use(router);

app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});

export default app;
