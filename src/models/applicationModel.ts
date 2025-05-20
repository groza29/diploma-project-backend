import { ApplicationAcceptationStatus } from './ApplicationAcceptionStatus';
import { Post } from './postModel';
import { UserWithJobs } from './userModel';

export interface Application {
  id: string;
  user_id: string;
  post_id: string;
  feedback?: string;
  status: boolean;
  accepted: ApplicationAcceptationStatus;
  createdAt: number;
  rating?: number;
}
export interface ApplicationWithPosts extends Omit<Application, 'post_id'> {
  post: Post;
}
export interface ApplicationWithUsers extends Omit<Application, 'user_id'> {
  user: UserWithJobs;
}
