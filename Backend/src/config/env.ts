import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('4000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  DB_HOST: z.string({ required_error: "DB_HOST es requerido" }),
  DB_USER: z.string({ required_error: "DB_USER es requerido" }),
  DB_PASS: z.string({ required_error: "DB_PASS es requerido" }),
  DB_NAME: z.string().default('ticketflow_db'),
  
  JWKS_URI: z.string().url({ message: "JWKS_URI debe ser una URL válida" }).optional(),
  ISSUER: z.string().url().optional(),
  AUDIENCE: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('Error crítico en variables de entorno:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;