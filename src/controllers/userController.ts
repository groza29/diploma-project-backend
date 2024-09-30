import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { User } from '../models/userModel';
import { v4 as uuidv4 } from 'uuid';
const bcrypt = require('bcrypt');

const userService = new UserService();

export const createUser = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    user.id = uuidv4();
    user.createdAt = new Date().toString();
    bcrypt.hash(user.password, 10, async (err: Error, hash: string) => {
      user.password = hash;
      await userService.createUser(user);
      res.status(200).json({ message: 'User created' });
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user: User | null = await userService.getUserById(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user: Partial<User> = req.body;
    if (Object.prototype.hasOwnProperty.call(user, 'password')) {
      bcrypt.hash(user.password, 10, async (err: Error, hash: string) => {
        user.password = hash;
        await userService.updateUser(req.params.id, user);
        console.log(user);
        res.json({ message: 'User updated' });
      });
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    await userService.deleteUserById(req.params.id);
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: err.message });
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
