import { Report } from '../models/reportModel';
import { ReportRepository } from '../repositories/reportRepository';
import { v4 as uuidv4 } from 'uuid';
import { UserRepository } from '../repositories/userRepository';
import { CustomError } from '../utils/CustomError';
import { PostRepository } from '../repositories/postRepository';
import { Status } from '../models/StatusEnum';
import { Type } from '../models/TypeEnum';

const reportRepository = new ReportRepository();
const userRepository = new UserRepository();
const postRepository = new PostRepository();

export class ReportService {
  async createReport(report: Report): Promise<void> {
    const newReport: Report = {
      id: uuidv4(),
      type: report.type,
      id_reported: report.id_reported,
      status: report.status ?? Status.OPEN,
      message: report.message,
      createdAt: Date.now(),
    };
    if (report.type === Type.USER) {
      const result = await userRepository.getUserById(report.id_reported);
      if (!result) {
        throw new CustomError("The id doesn't exist", 404);
      } else {
        await reportRepository.addReport(newReport);
      }
    }
    if (report.type === Type.POST) {
      const result = await postRepository.getPostById(report.id_reported);
      if (!result) {
        throw new CustomError("The id doesn't exist", 404);
      } else {
        await reportRepository.addReport(newReport);
      }
    }
  }
  async getReportById(reportId: string): Promise<Report> {
    const report: Report | null = await reportRepository.getReportById(reportId);
    if (report) {
      return report;
    } else {
      throw new CustomError('Report not found', 404);
    }
  }
  async getAllReports(): Promise<Report[]> {
    return await reportRepository.getAllReports();
  }
  async deleteReportById(reportId: string): Promise<void> {
    await reportRepository.deleteReportById(reportId);
  }
  async updateReport(reportId: string, report: Partial<Report>) {
    await reportRepository.updateReport(reportId, report);
  }
  async getReportsByStatus(status: string): Promise<Report[]> {
    return await reportRepository.getReportsByStatus(status);
  }
  async getReportsForAnId(id_reported: string): Promise<Report[]> {
    return await reportRepository.getReportsForAnId(id_reported);
  }
  async getReportsByType(type: string): Promise<Report[]> {
    return await reportRepository.getReportsByType(type);
  }
}
