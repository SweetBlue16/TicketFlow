import { Router } from 'express';
import { createTicket, getTickets } from '../controllers/ticket.controller';
import { validateToken } from '../middleware/auth';

const router = Router();

router.use(validateToken);

router.get('/', getTickets);

router.post('/', createTicket);

export default router;