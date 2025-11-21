import { Request, Response, NextFunction } from 'express';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { env } from '../config/env';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWKS = createRemoteJWKSet(new URL(env.JWKS_URI!));

export const validateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Token no proporcionado o formato incorrecto' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: env.ISSUER,
      audience: env.AUDIENCE,
    });

    req.user = payload;
    next();

  } catch (err) {
    console.error('Error de validación de token:', err);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

export const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRoles = (req.user?.realm_access?.roles || []) as string[];
    
    if (!userRoles.includes(role)) {
       res.status(403).json({ error: 'Acceso denegado: No tienes el rol necesario' });
       return;
    }
    next();
  };
};