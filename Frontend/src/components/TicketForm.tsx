import React, { useState } from 'react';
import { CreateTicketData } from '../types/ticket';
import './TicketForm.css';

interface TicketFormProps {
  onSubmit: (data: CreateTicketData) => Promise<void>;
  onCancel: () => void;
}

const TicketForm: React.FC<TicketFormProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'>('MEDIA');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onSubmit({ title, description, priority });
      // Limpiar formulario
      setTitle('');
      setDescription('');
      setPriority('MEDIA');
    } catch (err: any) {
      setError(err.message || 'Error al crear ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Crear Nuevo Ticket</h2>
          <button className="btn-close" onClick={onCancel}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="form-group">
            <label htmlFor="title">
              Título <span className="required">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Mi impresora no funciona"
              minLength={5}
              required
            />
            <small>{title.length}/100 caracteres (mínimo 5)</small>
          </div>

          <div className="form-group">
            <label htmlFor="description">
              Descripción <span className="required">*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el problema con detalle..."
              rows={5}
              minLength={10}
              required
            />
            <small>{description.length} caracteres (mínimo 10)</small>
          </div>

          <div className="form-group">
            <label htmlFor="priority">Prioridad</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
            >
              <option value="BAJA">🟢 Baja</option>
              <option value="MEDIA">🟡 Media</option>
              <option value="ALTA">🟠 Alta</option>
              <option value="CRITICA">🔴 Crítica</option>
            </select>
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;