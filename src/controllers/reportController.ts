import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';
import asyncHandler from '../utils/asyncHandler';
import { Report } from '../models/reportModel';

const reportService = new ReportService();

export const createReport = asyncHandler(async (req: Request, res: Response) => {
  await reportService.createReport(req.body);
  res.status(201).json({ message: 'Report created' });
});
export const getReportById = asyncHandler(async (req: Request, res: Response) => {
  const report: Report = await reportService.getReportById(req.params.id);
  res.status(200).json(report);
});
export const getAllReports = asyncHandler(async (req: Request, res: Response) => {
  const reports: Report[] = await reportService.getAllReports();
  res.status(200).json(reports);
});
export const deleteReportById = asyncHandler(async (req: Request, res: Response) => {
  await reportService.deleteReportById(req.params.id);
  res.status(204).json({ message: 'Report deleted' });
});
export const updateReport = asyncHandler(async (req: Request, res: Response) => {
  await reportService.updateReport(req.params.id, req.body);
  res.status(205).json({ message: 'Report updated' });
});
export const getReportsByStatus = asyncHandler(async (req: Request, res: Response) => {
  const reports: Report[] = await reportService.getReportsByStatus(req.params.status);
  res.status(200).json(reports);
});
export const getReportsForAnId = asyncHandler(async (req: Request, res: Response) => {
  const reports: Report[] = await reportService.getReportsForAnId(req.params.id_reported);
  res.status(200).json(reports);
});
export const getReportsByType = asyncHandler(async (req: Request, res: Response) => {
  const reports: Report[] = await reportService.getReportsByType(req.params.type);
  res.status(200).json(reports);
});
