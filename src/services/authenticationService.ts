import { Role } from '../models/RoleEnum';
import { User } from '../models/userModel';
import { UserRepository } from '../repositories/userRepository';
import { CustomError } from '../utils/CustomError';
import { hashPassword } from '../utils/hashPassword';
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'random';

export class AuthenticationService {
  private userRepository = new UserRepository();

  async register(user: User): Promise<void> {
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
        jobs: user.jobs || [],
      };
      const hashedPassword: string = await hashPassword(newUser.password);
      newUser.password = hashedPassword;
      await this.userRepository.addUser(newUser);
    }
  }
  async login(email: string, password: string): Promise<string> {
    if (typeof email !== 'string' || typeof password !== 'string') {
      throw new CustomError('Email and password must be strings', 400);
    }

    const user = await this.userRepository.getUserByEmail(email);
    if (!user) {
      throw new CustomError('Invalid email or password', 401);
    }

    // Ensure the hashed password is a string
    if (typeof user.password !== 'string') {
      console.log(user);
      throw new CustomError('Stored password format is invalid', 500);
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new CustomError('Invalid email or password', 401);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    return token;
  }
}
