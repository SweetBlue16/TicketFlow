import { Request, Response } from 'express';
import { z } from 'zod';
import { db } from '../config/database';

const createTicketSchema = z.object({
  title: z.string().min(5, "El título debe tener al menos 5 caracteres"),
  description: z.string().min(10, "La descripción debe ser más detallada"),
  priority: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).default('MEDIA'),
});

const updateTicketSchema = z.object({
  status: z.enum(['ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO']).optional(),
  priority: z.enum(['BAJA', 'MEDIA', 'ALTA', 'CRITICA']).optional(),
  assigned_to_email: z.string().email().optional(),
});

const commentSchema = z.object({
  content: z.string().min(1, "El comentario no puede estar vacío"),
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

export const updateTicket = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validation = updateTicketSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({ error: 'Datos inválidos', details: validation.error.format() });
      return;
    }

    const updates = validation.data;
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.status) { fields.push('status = ?'); values.push(updates.status); }
    if (updates.priority) { fields.push('priority = ?'); values.push(updates.priority); }
    if (updates.assigned_to_email) { fields.push('assigned_to_email = ?'); values.push(updates.assigned_to_email); }

    if (fields.length === 0) {
      res.status(400).json({ error: 'No enviaste nada para actualizar' });
      return;
    }

    values.push(id);

    const [result] = await db.execute(
      `UPDATE tickets SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    if ((result as any).affectedRows === 0) {
      res.status(404).json({ error: 'Ticket no encontrado' });
      return;
    }

    res.json({ message: 'Ticket actualizado' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar' });
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const validation = commentSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({ error: validation.error.errors[0].message });
      return;
    }

    const userEmail = req.user.email || req.user.preferred_username;
    const roles = req.user.realm_access?.roles || [];
    const roleDisplay = roles.includes('soporte') ? 'Soporte' : 'Usuario';

    await db.execute(
      'INSERT INTO comments (ticket_id, user_email, user_role, content) VALUES (?, ?, ?, ?)',
      [id, userEmail, roleDisplay, validation.data.content]
    );

    res.status(201).json({ message: 'Comentario agregado' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al comentar' });
  }
};

export const getTicketComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(
      'SELECT * FROM comments WHERE ticket_id = ? ORDER BY created_at ASC', 
      [id]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo comentarios' });
  }
};