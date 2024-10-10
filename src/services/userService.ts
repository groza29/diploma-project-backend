import { User } from '../models/userModel';
import { UserRepository } from '../repositories/userRepository';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
const userRepository = new UserRepository();

export class UserService {
  async createUser(user: User): Promise<void> {
    try {
      const newUser: User = {
        id: uuidv4(),
        createdAt: new Date().toString(),
        role: user.role || 'basic',
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
    } catch (error) {
      throw new Error(`Failed to create user: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  async getUserById(userID: string): Promise<User> {
    const user: User | null = await userRepository.getUserById(userID);
    if (user) {
      return user;
    } else {
      throw new Error('User not found');
    }
  }
  async deleteUserById(userID: string): Promise<void> {
    await userRepository.deleteUserById(userID);
  }
  async updateUser(userID: string, user: Partial<User>): Promise<void> {
    try {
      if (Object.prototype.hasOwnProperty.call(user, 'password')) {
        const hashedPassword = await this.hashPassword(user.password!);
        user.password = hashedPassword;
        await userRepository.updateUser(userID, user);
      } else {
        await userRepository.updateUser(userID, user);
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(`Failed to update user: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
    await userRepository.updateUser(userID, user);
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
