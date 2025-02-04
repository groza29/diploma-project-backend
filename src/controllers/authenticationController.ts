// src/controllers/authController.ts
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../utils/asyncHandler';
import { AuthenticationService } from '../services/authenticationService';

const authService = new AuthenticationService();

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  await authService.register(req.body);
  res.status(201).json({ message: 'User registered successfully' });
});

export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const token = await authService.login(email, password);
  res.status(200).json({ message: 'Login successful', token });
});
