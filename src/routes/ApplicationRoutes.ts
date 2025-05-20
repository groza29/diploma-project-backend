import { Router } from 'express';
import {
  acceptApplication,
  createApplication,
  deleteApplicationById,
  feedbackApplication,
  getAllApplications,
  getApplicationById,
  getApplicationsOfAnUser,
  getApplicationsOnAPost,
  rejectApplication,
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
router.put('/accept/:id', acceptApplication);
router.put('/reject/:id', rejectApplication);
router.put('/feedback/:id', feedbackApplication);
export default router;
