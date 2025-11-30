# 🎫 TicketFlow - Sistema de Gestión de Tickets Seguro (SSO)

**TicketFlow** es una aplicación web empresarial para la gestión de incidencias de soporte técnico. Este proyecto se centra en la implementación de Seguridad en el Desarrollo de Software, utilizando estándares modernos de autenticación (OIDC) y autorización (RBAC).

## 🛡️ Características de Seguridad (OWASP & STRIDE)

Este proyecto mitiga las vulnerabilidades comunes del Top 10 de OWASP mediante:
- **Autenticación Robusta:** Uso de Keycloak como Identity Provider (IdP) mediante el protocolo OpenID Connect (OIDC).
- **Protección contra Robo de Credenciales:** Implementación de PKCE (Proof Key for Code Exchange) en el Frontend (Cliente Público) para evitar la intercepción del código de autorización.
- **Validación de Tokens (Backend):** El API no confía ciegamente. Valida criptográficamente la firma RS256 del JWT utilizando el JWKS (JSON Web Key Set) de Keycloak en tiempo real.
- **Control de Acceso (RBAC):** Middleware estricto que diferencia entre roles `admin`, `soporte` y `usuario` para proteger endpoints sensibles.
- **Integridad de Datos:** Uso de Zod para validación estricta de esquemas de entrada y Prepared Statements en MySQL para prevenir Inyección SQL.
- **Cabeceras Seguras:** Implementación de Helmet para configurar cabeceras HTTP de seguridad.

## 🚀 Stack Tecnológico

- **Frontend:** React (Vite) + TypeScript + Tailwind CSS.
- **Backend:** Node.js + Express + TypeScript.
- **Base de Datos:** MySQL.
- **Identidad (IAM):** Keycloak (Standalone).
- **Librerías Clave:** react-oidc-context, jose (JWT validation), zod, mysql2.

## 📋 Prerrequisitos

- Node.js v18+ y npm.
- Java JDK 21 (Requerido para Keycloak 26).
- MySQL Server corriendo localmente.

## ⚙️ Guía de Instalación y Despliegue

**1. Configuración de Base de Datos (MySQL)**

- Abre tu cliente SQL (Workbench, DBeaver).
- Ejecuta el script de inicialización ubicado en: `Backend/src/database/init.sql`
- Crea un usuario dedicado para la aplicación (Principio de Mínimo Privilegio):
```sql
CREATE USER 'ticketflow_user'@'localhost' IDENTIFIED BY 'Tu_Password_Seguro';
GRANT SELECT, INSERT, UPDATE, DELETE ON ticketflow_db.* TO 'ticketflow_user'@'localhost';
FLUSH PRIVILEGES;
```

**2. Configuración de Keycloak (Identity Provider)**

- Descarga y descomprime Keycloak.
- Inicia Keycloak en modo desarrollo:
```bash
cd keycloak/bin
./kc.bat start-dev
```
- Accede a `http://localhost:8080` y crea el usuario administrador.
- Configuración del Realm:
  - Crear Realm: `ticketflow`.
  - Crear Cliente: `ticket-frontend`.
    - Valid Redirect URIs: `http://localhost:3000/*` (Puerto del Frontend).
    - Web Origins: `+`.
    - Authentication Flow: Standard Flow + PKCE (Client Auth: OFF).
  - Crear Roles: `soporte`, `usuario`, `admin`.
  - Crear Usuarios de prueba (ver tabla abajo).

**3. Configuración del Backend (API)**
- Navega a la carpeta Backend.
- Instala las dependencias:
```bash
npm install
```
- Crea un archivo .env en la raíz de Backend con el siguiente contenido:
```env
PORT=4000
NODE_ENV=development

# Credenciales MySQL
DB_HOST=localhost
DB_USER=ticketflow_user
DB_PASS=Tu_Password_Seguro
DB_NAME=ticketflow_db

# Seguridad OIDC (Keycloak)
# Nota: Asegúrate que el puerto coincida con tu Keycloak
JWKS_URI=http://localhost:8080/realms/ticketflow/protocol/openid-connect/certs
ISSUER=http://localhost:8080/realms/ticketflow
AUDIENCE=account
```
- Inicia el servidor:
```bash
npm run dev
```
Debería indicar: "Conexión a MySQL exitosa" y "Servidor corriendo en puerto 4000".

**4. Configuración del Frontend (React)**
- Navega a la carpeta `Frontend`.
- Instala las dependencias:
```bash
npm install
```
- Verifica la configuración en `src/main.tsx` (AuthProvider) para asegurar que apunta a tu Keycloak local.
- Inicia la aplicación:
```bash
npm run dev
```
- Abre el navegador en `http://localhost:3000`.

## 👤 Credenciales de Prueba

| Rol     | Usuario   | Contraseña | Permisos                                         |
| ------- | --------- | ---------- | ------------------------------------------------ |
| Técnico | tecnico1  | 1234       | Ver todos los tickets, cambiar estados, comentar |
| Usuario | empleado1 | 1234       | Crear tickets y ver los propios                  |


## 🧪 Pruebas de Seguridad Realizadas

- **Verificación de Firma JWT:** Se comprobó que el Backend rechaza tokens manipulados o expirados (Error 401).
- **Aislamiento de Datos:** Se verificó que el usuario `empleado1` no recibe tickets de otros usuarios en el endpoint `GET /api/tickets`.
- **Sanitización:** Zod bloquea intentos de enviar campos extraños o vacíos en el payload JSON.

## 📂 Estructura del Proyecto
```
TicketFlow/
├── Backend/                 # API Rest Segura (Node.js/Express)
│   ├── src/
│   │   ├── config/          # Configuración de BD y Variables de Entorno
│   │   ├── controllers/     # Lógica de negocio (Crear, Listar, Actualizar)
│   │   ├── middleware/      # Auth Gatekeeper (Validador de JWT)
│   │   └── routes/          # Definición de endpoints protegidos
│   └── .env                 # Secretos (No subir al repo)
│
└── Frontend/                # SPA Cliente (React)
    ├── src/
    │   ├── components/      # Componentes UI (Navbar, Tabla, Formularios)
    │   ├── pages/           # Vistas (Login, Dashboard)
    │   └── services/        # Cliente HTTP (fetch con Bearer Token)
    └── index.html
```

Desarrollado por Lizeth, Abraham, Xcaret, Mauricio y Georgina para la materia de Aspectos de Seguridad en el Desarrollo de Software.
