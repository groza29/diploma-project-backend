import { Application } from '../models/applicationModel';
import { Job } from '../models/jobModel';
import { Post } from '../models/postModel';
import { Report } from '../models/reportModel';
import { User } from '../models/userModel';

export function formatJobs(jobsIn: any): string[] {
  const jobArray: string[] = [];
  if (jobsIn && Array.isArray(jobsIn.L)) {
    jobsIn.L.forEach((job: any) => {
      if (job.S) {
        jobArray.push(job.S);
      }
    });
  }
  return jobArray;
}

export function formatUser(userIn: any): User {
  //this is used when using scan for getting users
  let user: User = {
    id: userIn.id.S,
    role: userIn.role.S,
    firstName: userIn.firstName.S,
    lastName: userIn.lastName.S,
    jobs: formatJobs(userIn.jobs) as unknown as Array<string>,
    email: userIn.email.S,
    password: userIn.password.S,
    description: userIn.description.S,
    phoneNumber: userIn.phoneNumber.S,
    rating: parseFloat(userIn.rating.S),
    country: userIn.country.S,
    county: userIn.county.S,
    city: userIn.city.S,
    activeStatus: userIn.activeStatus.BOOL,
    createdAt: userIn.createdAt.N,
    linkedin: userIn.linkedin.S,
    instagram: userIn.instagram.S,
  };
  return user;
}

export function formatPost(postIn: any): Post {
  let post: Post = {
    id: postIn.id.S,
    title: postIn.title.S,
    body: postIn.body.S,
    user_id: postIn.user_id.S,
    actionDate: postIn.actionDate.S,
    status: postIn.status.BOOL,
    createdAt: postIn.createdAt.N,
    jobs: postIn.jobs ? formatJobs(postIn.jobs) : [],
    imagesUrls: postIn.imagesUrls ? formatJobs(postIn.imagesUrls) : [],
  };
  return post;
}
export function formatReport(reportIn: any): Report {
  let report: Report = {
    id: reportIn.id.S,
    type: reportIn.id_reported.S,
    id_reported: reportIn.id_reported.S,
    message: reportIn.status.S,
    createdAt: reportIn.createdAt.N,
    status: reportIn.status.S,
  };
  return report;
}
export function formatApplication(applicationIn: any): Application {
  let applcation: Application = {
    id: applicationIn.id.S,
    user_id: applicationIn.user_id.S,
    post_id: applicationIn.post_id.S,
    message: applicationIn.message.S,
    status: applicationIn.status.BOOL,
    createdAt: applicationIn.createdAt.N,
    accepted: applicationIn.accepted.BOOL,
  };
  return applcation;
}
export function formatJob(jobIn: any): Job {
  let job: Job = {
    id: jobIn.id.S,
    type: jobIn.type.S,
    departament: jobIn.departament.S,
    name: jobIn.name.S,
  };

  return job;
}
