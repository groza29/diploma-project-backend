export interface User {
  id: string;
  role: 'admin' | 'basic';
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  description: string;
  phoneNumber: string;
  rating: number;
  country: string;
  county: string;
  city: string;
  activeStatus: boolean;
  createdAt: Date;
}