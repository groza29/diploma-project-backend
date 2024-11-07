import { Application } from '../models/applicationModel';
import { v4 as uuidv4 } from 'uuid';
import { ApplicationRepository } from '../repositories/applicationRepository';
import { PostRepository } from '../repositories/postRepository';
import { UserRepository } from '../repositories/userRepository';
import { CustomError } from '../utils/CustomError';

const applicationRepository = new ApplicationRepository();
const postRepository = new PostRepository();
const userRepository = new UserRepository();

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
  async getApplicationsOnAPost(post_id: string): Promise<Application[]> {
    return await applicationRepository.getApplicationsOnAPost(post_id);
  }
  async getApplicationsOfAnUser(user_id: string): Promise<Application[]> {
    return await applicationRepository.getApplicationsOfAnUser(user_id);
  }
}
