import { Router } from 'express';
import HistoricoControler from '../controller/historicoController.js';

const router = Router();

router.get('/atendimento/backup/historico', HistoricoControler.salvarHistoricoAtendimento);
router.get('/atendimento/historico/:protocolo', HistoricoControler.getHistoricoPorProtocolo);
router.get('/atendimento/backup/historico/:protocolo', HistoricoControler.salvarHistoricoAtendimentoPorProtocolo)

export default router;
