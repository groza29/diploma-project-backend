import { Router } from 'express';
import {
  createJob,
  deleteJobById,
  getAllJobs,
  getJobById,
  getJobsByDepartament,
  updateJob,
} from '../controllers/jobController';

const router = Router();

router.post('/jobs', createJob);
router.get('/jobs/:id', getJobById);
router.get('/jobs', getAllJobs);
router.get('/jobs-departament/:departament', getJobsByDepartament);
router.delete('/jobs/:id', deleteJobById);
router.put('/jobs/:id', updateJob);

export default router;
