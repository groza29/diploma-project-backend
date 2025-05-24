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

export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  res.status(200).json({ message: 'success' });
});

export const updatePassword = asyncHandler(async (req: Request, res: Response) => {
  await authService.updatePassword(req.params.id, req.body);
  res.status(200).json({ message: 'User updated' });
});
