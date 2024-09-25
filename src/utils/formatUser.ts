//this utils is used when using scan for getting users

import { User } from '../models/userModel';

export function formatUser(userIn: any) {
  let user: User = {
    id: userIn.id.S,
    role: userIn.role.S,
    firstName: userIn.firstName.S,
    lastName: userIn.lastName.S,
    email: userIn.email.S,
    password: userIn.password.S,
    description: userIn.description.S,
    phoneNumber: userIn.phoneNumber.S,
    rating: parseFloat(userIn.rating.S),
    country: userIn.country.S,
    county: userIn.county.S,
    city: userIn.city.S,
    activeStatus: userIn.activeStatus.BOOL,
    createdAt: userIn.createdAt.S,
  };
  return user;
}
