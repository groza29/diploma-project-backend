import { Router } from 'express';
import {
  createApplication,
  deleteApplicationById,
  getAllApplications,
  getApplicationById,
  getApplicationsOfAnUser,
  getApplicationsOnAPost,
  updateApplication,
} from '../controllers/applicationController';

const router = Router();

router.post('/application', createApplication);
router.get('/applications/post/:post_id', getApplicationsOnAPost);
router.get('/applications/user/:user_id', getApplicationsOfAnUser);
router.delete('/application/:id', deleteApplicationById);
router.get('/applications', getAllApplications);
router.get('/application/:id', getApplicationById);
router.put('/application/:id', updateApplication);
export default router;
