import { Router } from 'express';
import HistoricoControler from '../controller/historicoControle.js';

const router = Router();

router.get('/atendimento/historico', HistoricoControler.buscaHistorico);

export default router;
