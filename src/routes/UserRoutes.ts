import { Router } from 'express';
import {
  createUser,
  getUserById,
  deleteUserById,
  updateUser,
  getAllUsers,
  uploadAvatar,
  getAvatar,
} from '../controllers/userController';
import upload from '../config/multerConfig';

const router = Router();

router.post('/users', createUser);
router.post('/upload-avatar/:id', upload.single('avatar'), uploadAvatar);
router.get('/avatar/:id', getAvatar);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUserById);
router.put('/users/:id', updateUser);
router.get('/users', getAllUsers);
export default router;
