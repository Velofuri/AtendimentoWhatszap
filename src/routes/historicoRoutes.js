import { Router } from 'express';
import HistoricoControler from '../controller/historicoController.js';

const router = Router();

router.get('/atendimento/historico', HistoricoControler.buscaHistorico);

export default router;
