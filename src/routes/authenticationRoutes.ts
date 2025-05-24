import express from 'express';
import { register, login, forgotPassword, updatePassword } from '../controllers/authenticationController';
import { Router } from 'express';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.put('/forgot-password', forgotPassword);
router.put('/password/:id', updatePassword);

export default router;
