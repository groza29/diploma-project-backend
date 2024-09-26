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
    const user = await userService.getUserById(req.params.id, req.params.firstName);
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
    const firstName: string = req.params.firstName;
    const id: string = req.params.id;
    if (Object.prototype.hasOwnProperty.call(user, 'password')) {
      bcrypt.hash(user.password, 10, (err: Error, hash: string) => {
        user.password = hash;
      });
    }
    if (!Object.prototype.hasOwnProperty.call(user, 'firstName')) {
      await userService.updateUser(id, user, firstName);
    } else {
      const existingUser: User | null = await userService.getUserById(id, firstName);
      const updatedUser = {
        ...existingUser,
        ...user,
      } as User;
      await userService.updateUser(id, updatedUser, firstName);
    }
    res.json({ message: 'User updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteUserById = async (req: Request, res: Response) => {
  try {
    await userService.deleteUserById(req.params.id, req.params.firstName);
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
