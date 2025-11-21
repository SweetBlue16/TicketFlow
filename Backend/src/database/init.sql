CREATE DATABASE IF NOT EXISTS ticketflow_db;
USE ticketflow_db;

CREATE TABLE IF NOT EXISTS tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    priority ENUM('BAJA', 'MEDIA', 'ALTA', 'CRITICA') DEFAULT 'MEDIA',
    status ENUM('ABIERTO', 'EN_PROGRESO', 'RESUELTO', 'CERRADO') DEFAULT 'ABIERTO',

    created_by_email VARCHAR(255) NOT NULL,
    created_by_name VARCHAR(255),

    assigned_to_email VARCHAR(255),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_created_by (created_by_email),
    INDEX idx_status (status)
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,

    user_email VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) DEFAULT 'usuario', 
    
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);