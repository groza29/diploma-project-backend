import { Request, Response } from 'express';
import { JobService } from '../services/jobService';
import asyncHandler from '../utils/asyncHandler';
import { Job } from '../models/jobModel';

const jobService = new JobService();

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  await jobService.createJob(req.body);
  res.status(201).json({ message: 'Job created' });
});

export const getJobById = asyncHandler(async (req: Request, res: Response) => {
  const job: Job = await jobService.getJobById(req.params.id);
  res.status(200).json(job);
});

export const getAllJobs = asyncHandler(async (req: Request, res: Response) => {
  const jobs: any = await jobService.getAllJobs();
  res.status(200).json(jobs);
});

export const deleteJobById = asyncHandler(async (req: Request, res: Response) => {
  await jobService.deleteJobById(req.params.id);
  res.status(204).json({ message: 'Job deleted' });
});

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  await jobService.updateJob(req.params.id, req.body);
  res.status(205).json({ message: 'Job updated' });
});

export const getJobsByDepartament = asyncHandler(async (req: Request, res: Response) => {
  const jobs: Job[] = await jobService.getJobsByDepartament(req.params.departament);
  res.status(200).json(jobs);
});
