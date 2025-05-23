import { Application, ApplicationWithPosts, ApplicationWithUsers } from '../models/applicationModel';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationRepository } from '../repositories/applicationRepository';
import { PostRepository } from '../repositories/postRepository';
import { UserRepository } from '../repositories/userRepository';
import { CustomError } from '../utils/CustomError';
import { ApplicationAcceptationStatus } from '../models/ApplicationAcceptionStatus';
import { Job } from '../models/jobModel';
import { JobRepository } from '../repositories/jobRepository';
import { User } from '../models/userModel';
import { convertUserToUserWithJobs } from '../utils/userConvertWithJobs';
import { Post } from '../models/postModel';
import { getAiScoreFromFeedback } from '../utils/scoreFromFeedback';
import { sendAcceptanceEmail } from './mailService';

const applicationRepository = new ApplicationRepository();
const postRepository = new PostRepository();
const userRepository = new UserRepository();
const jobRepository = new JobRepository();

export class ApplicationService {
  async createApplication(application: Application): Promise<void> {
    const post = await postRepository.getPostById(application.post_id);
    const user = await userRepository.getUserById(application.user_id);
    if (post && user) {
      const result: Application[] = await applicationRepository.getApplicationByPostAndUser(
        application.post_id,
        application.user_id,
      );
      if (result.length >= 1) {
        throw new CustomError('Already applied', 302);
      }
      application.id = uuidv4();
      application.createdAt = Date.now();
      application.status = true;
      application.accepted = ApplicationAcceptationStatus.IN_PROGRESS;
      await applicationRepository.createApplication(application);
    } else {
      throw new CustomError('Something went wrong', 500);
    }
  }
  async getApplicationById(id: string): Promise<Application> {
    const applcation: Application = await applicationRepository.getApplicationById(id);
    if (applcation) {
      return applcation;
    } else {
      throw new CustomError('Application not found', 500);
    }
  }
  async getAllApplications(): Promise<Application[]> {
    return await applicationRepository.getAllApplications();
  }
  async deleteApplicationById(id: string): Promise<void> {
    await applicationRepository.deleteApplicationById(id);
  }
  async updateApplication(id: string, updates: Partial<Application>): Promise<void> {
    if (Object.prototype.hasOwnProperty.call(updates, 'user_id')) {
      const user = await userRepository.getUserById(updates.user_id!);
      if (!user) {
        throw new CustomError('Error at user', 404);
      }
    }
    if (Object.prototype.hasOwnProperty.call(updates, 'post_id')) {
      const post = await postRepository.getPostById(updates.post_id!);
      if (!post) {
        throw new CustomError('Error at post', 404);
      }
    }
    await applicationRepository.updateApplication(id, updates);
  }
  async getApplicationsOnAPost(post_id: string): Promise<ApplicationWithUsers[]> {
    const applications = await applicationRepository.getApplicationsOnAPost(post_id);
    const applicationsWithUsers = await Promise.all(
      applications.map(async (app) => {
        const user = await userRepository.getUserById(app.user_id);
        const jobs: Job[] = await jobRepository.getAllJobs();

        if (!user) throw new CustomError(`user not found for user_id ${app.user_id}`, 404);

        const { user_id, ...rest } = app;
        const userWithJobs = convertUserToUserWithJobs(user, jobs);
        return {
          ...rest,
          user: userWithJobs,
        };
      }),
    );
    return applicationsWithUsers;
  }
  async getApplicationsOfAnUser(user_id: string): Promise<ApplicationWithPosts[]> {
    const applications = await applicationRepository.getApplicationsOfAnUser(user_id);

    const applicationsWithPosts = await Promise.all(
      applications.map(async (app) => {
        const post = await postRepository.getPostById(app.post_id);
        if (!post) throw new CustomError(`Post not found for post_id ${app.post_id}`, 404);

        const { post_id, ...rest } = app;

        return {
          ...rest,
          post,
        };
      }),
    );

    return applicationsWithPosts;
  }
  async acceptApplication(id: string): Promise<void> {
    const application: Application = await applicationRepository.getApplicationById(id);
    const post: Post | null = await postRepository.getPostById(application.post_id);

    if (!post) {
      throw new CustomError('Something went wrong', 404);
    }
    if (post.status === false) throw new CustomError('Something went wrong', 404);

    post.status = false;

    const { id: _postID, ...postWithoutId } = post;
    await postRepository.updatePost(post.id, postWithoutId);

    const postApplications: Application[] = await applicationRepository.getApplicationsOnAPost(post.id);

    await Promise.all(
      postApplications
        .filter((app) => app.id !== application.id)
        .map(async (app) => {
          app.accepted = ApplicationAcceptationStatus.REJECTED;
          const { id: _, ...appWithoutId } = app;
          await applicationRepository.updateApplication(app.id, appWithoutId);
        }),
    );

    application.accepted = ApplicationAcceptationStatus.ACCEPTED;
    const user: User | null = await userRepository.getUserById(application.user_id);

    if (user && user.email) {
      await sendAcceptanceEmail(user.email, `${user.lastName} ${user.firstName}`, post.title);
    }

    const { id: _, user_id: _user_id, post_id: _post_id, ...acceptedWithoutId } = application;
    await applicationRepository.updateApplication(application.id, acceptedWithoutId);
  }
  async rejectApplication(id: string): Promise<void> {
    const application: Application = await applicationRepository.getApplicationById(id);
    const { id: _, user_id: _user_id, post_id: _post_id, ...acceptedWithoutId } = application;
    acceptedWithoutId.accepted = ApplicationAcceptationStatus.REJECTED;
    await applicationRepository.updateApplication(id, acceptedWithoutId);
  }
  async feedbackApplication(id: string, feedback: string, rating: number): Promise<void> {
    const application: Application = await applicationRepository.getApplicationById(id);
    const user: User | null = await userRepository.getUserById(application.user_id);

    if (!user) throw new CustomError('User not found', 404);
    const aiScore = await getAiScoreFromFeedback(rating, feedback);
    console.log('ai score:', aiScore);
    application.feedback = feedback;
    application.rating = rating;
    application.score = aiScore;
    console.log('acceptedwithoutid:', application);
    const { id: _, user_id: _user_id, post_id: _post_id, ...acceptedWithoutId } = application;

    await applicationRepository.updateApplication(id, acceptedWithoutId);

    await new Promise((res) => setTimeout(res, 200));

    const updatedApplications: Application[] = await applicationRepository.getApplicationsOfAnUser(application.user_id);

    const finishedAcceptedApps = updatedApplications.filter(
      (app) =>
        app.status === false &&
        app.accepted === ApplicationAcceptationStatus.ACCEPTED &&
        app.rating !== undefined &&
        app.feedback !== undefined &&
        app.id !== application.id,
    );
    finishedAcceptedApps.push(application);
    console.log('finished accepted apps', finishedAcceptedApps);

    let totalRating: number = 0;
    let totalScore: number = 0;
    let count: number = 0;

    for (const app of finishedAcceptedApps) {
      const rating = typeof app.rating === 'string' ? parseFloat(app.rating) : app.rating;
      const score = typeof app.score === 'string' ? parseFloat(app.score) : app.score;

      if (!isNaN(rating!) && !isNaN(score!)) {
        totalRating += rating!;
        totalScore += score!;
        count++;
      }
    }

    console.log('total rating:', totalRating, 'total score:', totalScore, 'Total count', count);
    if (count > 0) {
      user.rating = totalRating / count;
      user.score = totalScore / count;
    }

    const { id: _user, ...userWithoutId } = user;
    console.log(userWithoutId);
    await userRepository.updateUser(application.user_id, userWithoutId);
  }
}
