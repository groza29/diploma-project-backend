import { Job } from '../models/jobModel';
import { JobRepository } from '../repositories/jobRepository';
import { v4 as uuidv4 } from 'uuid';
import { CustomError } from '../utils/CustomError';

const jobRepository = new JobRepository();

export class JobService {
  async createJob(job: Job): Promise<void> {
    job.id = uuidv4();
    await jobRepository.createJob(job);
  }
  async getJobById(id: string): Promise<Job> {
    const job: Job | null = await jobRepository.getJobById(id);
    if (job) {
      return job;
    } else {
      throw new CustomError('Job not found', 404);
    }
  }
  async getAllJobs(): Promise<Job[]> {
    return await jobRepository.getAllJobs();
  }
  async deleteJobById(id: string): Promise<void> {
    await jobRepository.deleteJobById(id);
  }
  async updateJob(id: string, updates: Partial<Job>): Promise<void> {
    if (Object.prototype.hasOwnProperty.call(updates, 'id')) {
      const { id: _, ...jobWithoutId } = updates;
      await jobRepository.updateJob(id, jobWithoutId);
    } else {
      await jobRepository.updateJob(id, updates);
    }
  }
  async getJobsByDepartament(departament: string): Promise<Job[]> {
    return await jobRepository.getJobsByDepartament(departament);
  }
}
