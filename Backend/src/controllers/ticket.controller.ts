import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../config/database';

const createTicketSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(10, "La descripción debe ser más detallada"),
  priority: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).default('MEDIA'),
});

export const createTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const validation = createTicketSchema.safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({ 
        error: 'Datos inválidos', 
        details: validation.error.format() 
      });
      return;
    }

    const { title, description, priority } = validation.data;

    const userEmail = req.user.email || req.user.preferred_username || 'unknown';
    const userName = req.user.name || req.user.given_name || 'Usuario';

    const [result] = await db.execute(
      `INSERT INTO tickets (title, description, priority, created_by_email, created_by_name, status) 
       VALUES (?, ?, ?, ?, ?, 'ABIERTO')`,
      [title, description, priority, userEmail, userName]
    );

    res.status(201).json({ 
      message: 'Ticket creado exitosamente', 
      ticketId: (result as any).insertId 
    });

  } catch (error) {
    console.error('Error creando ticket:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const getTickets = async (req: Request, res: Response): Promise<void> => {
  try {
    const userEmail = req.user.email || req.user.preferred_username;
    const userRoles = (req.user.realm_access?.roles || []) as string[];

    const isAdminOrSupport = userRoles.includes('soporte') || userRoles.includes('admin');

    let query = 'SELECT * FROM tickets';
    let params: any[] = [];

    if (!isAdminOrSupport) {
      query += ' WHERE created_by_email = ?';
      params.push(userEmail);
    }

    query += ' ORDER BY created_at DESC';

    const [rows] = await db.execute(query, params);
    res.json(rows);

  } catch (error) {
    console.error('Error obteniendo tickets:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};