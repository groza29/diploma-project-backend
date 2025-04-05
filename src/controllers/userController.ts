import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { UserWithJobs } from '../models/userModel';
import asyncHandler from '../utils/asyncHandler';

const userService = new UserService();

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.createUser(req.body);
  res.status(201).json({ message: 'User created successfully' });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user: UserWithJobs = await userService.getUserById(req.params.id);
  res.status(200).json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  await userService.updateUser(req.params.id, req.body);
  res.status(200).json({ message: 'User updated' });
});

export const deleteUserById = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteUserById(req.params.id);
  res.status(204).send('user deleted');
});
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users: UserWithJobs[] = await userService.getAllUsers();
  res.status(200).json(users);
});

export const uploadAvatar = asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
  if (!req.file) {
    res.status(404).json({ message: 'Missing file' });
  }
  const avatarUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/avatars/${req.params.id}.jpg`;

  res.status(200).json({ message: 'Avatar uploaded successfully', avatarUrl });
});

export const getAvatar = asyncHandler(async (req: Request, res: Response) => {
  const avatar = await userService.getAvatar(req.params.id);
  res.setHeader('Content-Type', 'image/jpeg');
  avatar.pipe(res);
});
