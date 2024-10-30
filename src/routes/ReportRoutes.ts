import { Router } from 'express';
import {
  createReport,
  deleteReportById,
  getAllReports,
  getReportById,
  getReportsByStatus,
  getReportsByType,
  getReportsForAnId,
  updateReport,
} from '../controllers/reportController';

const router = Router();

router.post('/reports', createReport);
router.get('/reports/:id', getReportById);
router.get('/reports', getAllReports);
router.get('/reports-status/:status', getReportsByStatus);
router.get('/reports-id/:id_reported', getReportsForAnId);
router.get('/reports-type/:type', getReportsByType);
router.delete('/reports/:id', deleteReportById);
router.put('/reports/:id', updateReport);
export default router;
