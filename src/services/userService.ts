import { User } from '../models/userModel';
import { UserRepository } from '../repositories/userRepository';

const userRepository = new UserRepository();

export class UserService {
  async createUser(user: User): Promise<void> {
    await userRepository.addUser(user);
  }
  async getUserById(userID: string): Promise<User | null> {
    return await userRepository.getUserById(userID);
  }
  async deleteUserById(userID: string): Promise<void> {
    await userRepository.deleteUserById(userID);
  }
  async updateUser(userID: string, user: Partial<User>): Promise<void> {
    await userRepository.updateUser(userID, user);
  }
  async getAllUsers(): Promise<User[]> {
    return await userRepository.getAllUsers();
  }
}
