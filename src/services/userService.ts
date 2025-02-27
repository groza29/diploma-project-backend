import { User, UserWithJobs } from '../models/userModel';
import { UserRepository } from '../repositories/userRepository';
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from '../utils/CustomError';
import { Role } from '../models/RoleEnum';
import { JobRepository } from '../repositories/jobRepository';
import { Job } from '../models/jobModel';
import { convertUserToUserWithJobs } from '../utils/userConvertWithJobs';
import { hashPassword } from '../utils/hashPassword';

export class UserService {
  private userRepository = new UserRepository();
  private jobRepository = new JobRepository();
  async createUser(user: User): Promise<void> {
    const existing = await this.userRepository.getUserByEmail(user.email);
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
        jobs: user.jobs || null,
        linkedin: user.linkedin || '',
        instagram: user.instagram || '',
      };
      const hashedPassword: string = await hashPassword(newUser.password);
      newUser.password = hashedPassword;
      await this.userRepository.addUser(newUser);
    }
  }
  async getUserById(userID: string): Promise<UserWithJobs> {
    const user: User | null = await this.userRepository.getUserById(userID);
    if (user) {
      const jobs: Job[] = await this.jobRepository.getAllJobs();
      const userOut: UserWithJobs = convertUserToUserWithJobs(user, jobs);
      return userOut;
    } else {
      throw new CustomError('User not found', 404);
    }
  }
  async deleteUserById(userID: string): Promise<void> {
    await this.userRepository.deleteUserById(userID);
  }
  async updateUser(userID: string, user: Partial<User>): Promise<void> {
    if (Object.prototype.hasOwnProperty.call(user, 'password')) {
      const hashedPassword = await hashPassword(user.password!);
      user.password = hashedPassword;
      await this.userRepository.updateUser(userID, user);
    } else {
      await this.userRepository.updateUser(userID, user);
    }
  }
  async getAllUsers(): Promise<UserWithJobs[]> {
    const jobs: Job[] = await this.jobRepository.getAllJobs();
    const users: User[] = await this.userRepository.getAllUsers();
    const usersWithJobs: UserWithJobs[] = users.map((user) => {
      const userWithJobs = convertUserToUserWithJobs(user, jobs);
      return userWithJobs;
    });

    return usersWithJobs.filter((user) => user.role == Role.BASIC);
  }
}
