import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { User } from '../models/userModel';

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
  try {
    await userService.createUser(req.body);
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Unknown error occurred' });
    }
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user: User = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'User not found') {
        res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    await userService.updateUser(req.params.id, req.body);
    res.json({ message: 'User updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    await userService.deleteUserById(req.params.id);
    res.status(204).send('user deleted');
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: User[] = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};
