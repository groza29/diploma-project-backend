import { Job } from './jobModel';

export interface Post {
  id: string;
  title: string;
  body: string;
  user_id: string;
  actionDate: Date;
  status: boolean;
  jobs: Set<Job>;
  createdAt: number;
}
