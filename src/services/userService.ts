import { User } from '../models/userModel';
import { UserRepository } from '../repositories/userRepository';

const userRepository = new UserRepository();

export class UserService {
  async createUser(user: User): Promise<void> {
    await userRepository.addUser(user);
  }
  async getUserById(userID: string, firstName: string): Promise<User | null> {
    return await userRepository.getUserById(userID, firstName);
  }
  async deleteUserById(userID: string, firstName: string): Promise<void> {
    await userRepository.deleteUserById(userID, firstName);
  }
  async updateUser(userID: string, user: Partial<User>, firstName: string): Promise<void> {
    await userRepository.updateUser(userID, user, firstName);
  }
  async getAllUsers(): Promise<User[]> {
    return await userRepository.getAllUsers();
  }
}
