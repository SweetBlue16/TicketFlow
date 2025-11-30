import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TicketTable from '../components/TicketTable';
import TicketForm from '../components/TicketForm';
import { Ticket, UserInfo, CreateTicketData } from '../types/ticket';
import { api } from '../services/api';
import './Dashboard.css';

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ token, onLogout }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  useEffect(() => {
    // Obtener info del usuario del token
    try {
      const payload = api.decodeToken(token);
      const userInfo: UserInfo = {
        email: payload.email || payload.preferred_username || 'usuario@example.com',
        name: payload.name || payload.given_name || 'Usuario',
        roles: payload.realm_access?.roles || []
      };
      setUser(userInfo);
    } catch (error) {
      console.error('Error decodificando token:', error);
      onLogout();
    }

    // Cargar tickets
    loadTickets();
  }, [token]);

  useEffect(() => {
    // Aplicar filtros
    let filtered = [...tickets];

    if (statusFilter) {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (priorityFilter) {
      filtered = filtered.filter(t => t.priority === priorityFilter);
    }

    setFilteredTickets(filtered);
  }, [tickets, statusFilter, priorityFilter]);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await api.getTickets(token);
      setTickets(data);
      setFilteredTickets(data);
    } catch (error: any) {
      console.error('Error cargando tickets:', error);
      if (error.message.includes('401') || error.message.includes('Token')) {
        alert('Tu sesión ha expirado. Por favor inicia sesión nuevamente.');
        onLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (data: CreateTicketData) => {
    try {
      await api.createTicket(token, data);
      setShowCreateForm(false);
      loadTickets();
      alert('✅ Ticket creado exitosamente');
    } catch (error: any) {
      throw error;
    }
  };

  const handleTicketClick = (ticket: Ticket) => {
    alert(`Ver detalles del ticket #${ticket.id}\n\nEsta funcionalidad se implementará en el modal de detalles.`);
  };

  if (!user) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="dashboard">
      <Navbar user={user} onLogout={onLogout} />

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Mis Tickets de Soporte</h1>
          <button 
            className="btn-create"
            onClick={() => setShowCreateForm(true)}
          >
            + Crear Nuevo Ticket
          </button>
        </div>

        <div className="dashboard-filters">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos los estados</option>
            <option value="ABIERTO">Abierto</option>
            <option value="EN_PROGRESO">En Progreso</option>
            <option value="RESUELTO">Resuelto</option>
            <option value="CERRADO">Cerrado</option>
          </select>

          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">Todas las prioridades</option>
            <option value="BAJA">Baja</option>
            <option value="MEDIA">Media</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>

          <button 
            className="btn-refresh"
            onClick={loadTickets}
          >
            🔄 Actualizar
          </button>
        </div>

        <TicketTable 
          tickets={filteredTickets}
          onTicketClick={handleTicketClick}
          loading={loading}
        />

        {showCreateForm && (
          <TicketForm
            onSubmit={handleCreateTicket}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;