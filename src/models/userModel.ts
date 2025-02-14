import { Job } from './jobModel';
import { Role } from './RoleEnum';

export interface User {
  id: string;
  role: Role;
  firstName: string;
  lastName: string;
  jobs: Set<string> | null;
  email: string;
  password: string;
  description: string;
  phoneNumber: string;
  rating: number;
  country: string;
  county: string;
  city: string;
  activeStatus: boolean;
  createdAt: number;
}
export interface UserWithJobs extends Omit<User, 'jobs' | 'password'> {
  jobs: Job[];
}
