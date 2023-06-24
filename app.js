import express from 'express';
import router from './src/routes/historicoRoutes.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`Servidor escutando na porta ${port}`);
});

export default app;
