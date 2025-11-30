import { Ticket, Comment, CreateTicketData, UpdateTicketData } from '../types/ticket';

const API_URL = 'http://localhost:4000/api';

export const api = {
  // Obtener todos los tickets
  async getTickets(token: string): Promise<Ticket[]> {
    const response = await fetch(`${API_URL}/tickets`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener tickets');
    }
    
    return response.json();
  },

  // Crear un ticket
  async createTicket(token: string, data: CreateTicketData): Promise<{ message: string; ticketId: number }> {
    const response = await fetch(`${API_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al crear ticket');
    }
    
    return response.json();
  },

  // Actualizar un ticket
  async updateTicket(token: string, ticketId: number, data: UpdateTicketData): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/tickets/${ticketId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al actualizar ticket');
    }
    
    return response.json();
  },

  // Obtener comentarios de un ticket
  async getComments(token: string, ticketId: number): Promise<Comment[]> {
    const response = await fetch(`${API_URL}/tickets/${ticketId}/comments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener comentarios');
    }
    
    return response.json();
  },

  // Agregar un comentario
  async addComment(token: string, ticketId: number, content: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/tickets/${ticketId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ content })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error al agregar comentario');
    }
    
    return response.json();
  },

  // Decodificar token para obtener info del usuario
  decodeToken(token: string): any {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
};