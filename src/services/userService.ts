import { User } from '../models/userModel';
import { UserRepository } from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from '../utils/CustomError';
import { Role } from '../models/RoleEnum';
const userRepository = new UserRepository();

export class UserService {
  async createUser(user: User): Promise<void> {
    const existing = await userRepository.getUserByEmail(user.email);
    if (existing) {
      throw new CustomError('The email already exists', 400);
    } else {
      const newUser: User = {
        id: uuidv4(),
        createdAt: Date.now(),
        role: user.role || Role.BASIC,
        activeStatus: user.activeStatus ?? true,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        description: user.description,
        phoneNumber: user.phoneNumber,
        rating: user.rating ?? 0,
        country: user.country,
        county: user.county,
        city: user.city,
        jobs: user.jobs || [],
      };
      const hashedPassword: string = await this.hashPassword(newUser.password);
      newUser.password = hashedPassword;
      await userRepository.addUser(newUser);
    }
  }
  async getUserById(userID: string): Promise<User> {
    const user: User | null = await userRepository.getUserById(userID);
    if (user) {
      return user;
    } else {
      throw new CustomError('User not found', 404);
    }
  }
  async deleteUserById(userID: string): Promise<void> {
    await userRepository.deleteUserById(userID);
  }
  async updateUser(userID: string, user: Partial<User>): Promise<void> {
    if (Object.prototype.hasOwnProperty.call(user, 'password')) {
      const hashedPassword = await this.hashPassword(user.password!);
      user.password = hashedPassword;
      await userRepository.updateUser(userID, user);
    } else {
      await userRepository.updateUser(userID, user);
    }
  }
  async getAllUsers(): Promise<User[]> {
    return await userRepository.getAllUsers();
  }
  private async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  }
}
