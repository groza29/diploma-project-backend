import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { User } from '../models/userModel';
import asyncHandler from '../utils/asyncHandler';

const userService = new UserService();

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.createUser(req.body);
  res.status(201).json({ message: 'User created successfully' });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user: User = await userService.getUserById(req.params.id);
  res.json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.updateUser(req.params.id, req.body);
  res.json({ message: 'User updated' });
});

export const deleteUserById = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUserById(req.params.id);
  res.status(204).send('user deleted');
});
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users: User[] = await userService.getAllUsers();
  res.json(users);
});
