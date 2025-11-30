import React, { useState } from 'react';
import { api } from '../services/api';
import './Login.css';

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validar que el token sea válido
      api.decodeToken(token);
      onLogin(token);
    } catch (err) {
      setError('Token inválido. Por favor verifica que sea un JWT válido.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>🎫 TicketFlow</h1>
          <p>Sistema de Gestión de Tickets de Soporte</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="token">Token de Acceso</label>
            <textarea
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Pega tu token JWT aquí..."
              rows={6}
              required
            />
          </div>

          {error && (
            <div className="error-message">
              ❌ {error}
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Validando...' : 'Iniciar Sesión'}
          </button>

          <div className="info-box">
            <p><strong>ℹ️ Instrucciones:</strong></p>
            <ol>
              <li>Autentica en tu proveedor SSO (Keycloak/Auth0)</li>
              <li>Copia el token JWT</li>
              <li>Pégalo aquí para acceder</li>
            </ol>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;