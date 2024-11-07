import { Job } from '../models/jobModel';
import { User, UserWithJobs } from '../models/userModel';

export function convertUserToUserWithJobs(user: User, jobs: Job[]): UserWithJobs {
  const jobDetails = Array.from(user.jobs)
    .map((id_job) => jobs.find((job) => job.id === id_job))
    .filter((job): job is Job => job !== undefined);

  const newUser: UserWithJobs = {
    ...user,
    jobs: jobDetails,
  };
  console.log(newUser);

  return newUser;
}
