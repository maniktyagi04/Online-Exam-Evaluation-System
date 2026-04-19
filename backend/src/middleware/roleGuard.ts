import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';

/**
 * Role-based access guard. Pass one or more allowed roles.
 * Usage: requireRole('ADMIN') or requireRole('ADMIN', 'STUDENT')
 */
export const requireRole = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: requires role ${roles.join(' or ')}`,
      });
      return;
    }

    next();
  };
};
