import React from 'react';
import { Ticket } from '../types/ticket';
import './TicketTable.css';

interface TicketTableProps {
  tickets: Ticket[];
  onTicketClick: (ticket: Ticket) => void;
  loading?: boolean;
}

const TicketTable: React.FC<TicketTableProps> = ({ tickets, onTicketClick, loading }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days < 7) return `Hace ${days}d`;
    
    return date.toLocaleDateString('es-MX', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      'ABIERTO': 'Abierto',
      'EN_PROGRESO': 'En Progreso',
      'RESUELTO': 'Resuelto',
      'CERRADO': 'Cerrado'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="tickets-loading">
        <div className="spinner"></div>
        <p>Cargando tickets...</p>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="tickets-empty">
        <div className="empty-icon">📋</div>
        <h3>No hay tickets para mostrar</h3>
        <p>Crea un nuevo ticket para empezar</p>
      </div>
    );
  }

  return (
    <div className="tickets-grid">
      {tickets.map((ticket) => (
        <div 
          key={ticket.id} 
          className="ticket-card"
          onClick={() => onTicketClick(ticket)}
        >
          <div className="ticket-header">
            <div className="ticket-id">#{ticket.id}</div>
            <div className="ticket-badges">
              <span className={`status-badge status-${ticket.status}`}>
                {getStatusLabel(ticket.status)}
              </span>
              <span className={`priority-badge priority-${ticket.priority}`}>
                {ticket.priority}
              </span>
            </div>
          </div>

          <h3 className="ticket-title">{ticket.title}</h3>
          
          <p className="ticket-description">
            {ticket.description.length > 120 
              ? `${ticket.description.substring(0, 120)}...` 
              : ticket.description}
          </p>

          <div className="ticket-footer">
            <div className="ticket-user">
              <span className="user-icon">👤</span>
              <span>{ticket.created_by_name || ticket.created_by_email}</span>
            </div>
            <div className="ticket-date">
              <span className="date-icon">📅</span>
              <span>{formatDate(ticket.created_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TicketTable;