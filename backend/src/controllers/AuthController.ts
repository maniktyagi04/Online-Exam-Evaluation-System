import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';
import { ApiError } from '../utils/ApiError';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        res.status(400).json({
          success: false,
          message: 'Name, email, and password are required',
        });
        return;
      }


      const result = await this.authService.register(name, email, password);
      res.status(201).json({ success: true, message: 'Account created', ...result });
    } catch (err) {
      if (err instanceof ApiError) {
        res.status(err.statusCode).json({ success: false, message: err.message });
      } else {
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, message: 'Email and password are required' });
        return;
      }

      const result = await this.authService.login(email, password);
      res.status(200).json({ success: true, message: 'Login successful', ...result });
    } catch (err) {
      if (err instanceof ApiError) {
        res.status(err.statusCode).json({ success: false, message: err.message });
      } else {
        res.status(500).json({ success: false, message: 'Internal server error' });
      }
    }
  };
}
