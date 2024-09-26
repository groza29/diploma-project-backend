import { Router } from 'express';
import { createUser, getUserById, deleteUserById, updateUser, getAllUsers } from '../controllers/userController';

const router = Router();

router.post('/users', createUser);
router.get('/users/:id/:firstName', getUserById);
router.delete('/users/:id/:firstName', deleteUserById);
router.put('/users/:id/:firstName', updateUser);
router.get('/users', getAllUsers);
export default router;
