import { Router } from 'express';
import { createTicket, getTickets, updateTicket, addComment, getTicketComments } from '../controllers/ticket.controller';
import { validateToken, requireRole } from '../middleware/auth';

const router = Router();

router.use(validateToken);

router.get('/', getTickets);

router.post('/', createTicket);

router.patch('/:id', updateTicket);

router.get('/:id/comments', getTicketComments);

router.post('/:id/comments', addComment);

export default router;