import express from 'express';
import { register, login } from '../controllers/authenticationController';
import { Router } from 'express';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
