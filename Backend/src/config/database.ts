import mysql from 'mysql2/promise';
import { env } from './env';

export const db = mysql.createPool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10, 
  queueLimit: 0
});

export const checkDatabaseConnection = async () => {
  try {
    const connection = await db.getConnection();
    console.log('Conexión a MySQL exitosa');
    connection.release(); 
  } catch (error) {
    console.error('Error conectando a MySQL:', error);
    process.exit(1);
  }
};