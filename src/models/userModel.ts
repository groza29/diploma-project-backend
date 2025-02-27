import { Job } from './jobModel';
import { Role } from './RoleEnum';

export interface User {
  id: string;
  role: Role;
  firstName: string;
  lastName: string;
  jobs: Array<string>;
  email: string;
  password: string;
  description: string;
  phoneNumber: string;
  rating: number;
  country: string;
  county: string;
  city: string;
  linkedin: string;
  instagram: string;
  activeStatus: boolean;
  createdAt: number;
}
export interface UserWithJobs extends Omit<User, 'jobs' | 'password'> {
  jobs: Job[];
}
