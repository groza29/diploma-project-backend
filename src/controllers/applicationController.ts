import { application, Request, Response } from 'express';
import { ApplicationService } from '../services/applicationService';
import asyncHandler from '../utils/asyncHandler';
import { Application, ApplicationWithPosts, ApplicationWithUsers } from '../models/applicationModel';

const applicationService = new ApplicationService();

export const createApplication = asyncHandler(async (req: Request, res: Response) => {
  await applicationService.createApplication(req.body);
  res.status(201).json({ message: 'Application created' });
});

export const getApplicationById = asyncHandler(async (req: Request, res: Response) => {
  const applcation: Application = await applicationService.getApplicationById(req.params.id);
  res.status(200).json(applcation);
});

export const getAllApplications = asyncHandler(async (req: Request, res: Response) => {
  const applications: Application[] = await applicationService.getAllApplications();
  res.status(200).json(applications);
});

export const deleteApplicationById = asyncHandler(async (req: Request, res: Response) => {
  await applicationService.deleteApplicationById(req.params.id);
  res.status(204).send('Application Deleted');
});

export const updateApplication = asyncHandler(async (req: Request, res: Response) => {
  await applicationService.updateApplication(req.params.id, req.body);
  res.status(205).json({ message: 'Application modified' });
});

export const getApplicationsOnAPost = asyncHandler(async (req: Request, res: Response) => {
  const applications: ApplicationWithUsers[] = await applicationService.getApplicationsOnAPost(req.params.post_id);
  res.status(200).json(applications);
});

export const getApplicationsOfAnUser = asyncHandler(async (req: Request, res: Response) => {
  const applications: ApplicationWithPosts[] = await applicationService.getApplicationsOfAnUser(req.params.user_id);
  res.status(200).json(applications);
});

export const acceptApplication = asyncHandler(async (req: Request, res: Response) => {
  await applicationService.acceptApplication(req.params.id);
  res.status(200).json(application);
});
export const rejectApplication = asyncHandler(async (req: Request, res: Response) => {
  await applicationService.rejectApplication(req.params.id);
  res.status(200).json(application);
});
export const feedbackApplication = asyncHandler(async (req: Request, res: Response) => {
  await applicationService.feedbackApplication(req.params.id, req.body.feedback, req.body.rating);
  res.status(200).json({ message: 'feedback sent' });
});
