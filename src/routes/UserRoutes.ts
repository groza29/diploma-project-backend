import { Router } from 'express';
import { createUser, getUserById, deleteUserById, updateUser, getAllUsers } from '../controllers/userController';

const router = Router();

router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.delete('/users/:id', deleteUserById);
router.put('/users/:id', updateUser);
router.get('/users', getAllUsers);
export default router;
