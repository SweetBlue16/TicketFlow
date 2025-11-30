export interface Ticket {
  id: number;
  title: string;
  description: string;
  priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  status: 'ABIERTO' | 'EN_PROGRESO' | 'RESUELTO' | 'CERRADO';
  created_by_email: string;
  created_by_name: string;
  assigned_to_email?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  ticket_id: number;
  user_email: string;
  user_role: string;
  content: string;
  created_at: string;
}

export interface CreateTicketData {
  title: string;
  description: string;
  priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
}

export interface UpdateTicketData {
  status?: 'ABIERTO' | 'EN_PROGRESO' | 'RESUELTO' | 'CERRADO';
  priority?: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';
  assigned_to_email?: string;
}

export interface UserInfo {
  email: string;
  name: string;
  roles: string[];
}