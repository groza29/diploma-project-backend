import { Router } from 'express';
import { createPost, getAllPosts, getPostById } from '../controllers/postController';

const router = Router();

router.post('/posts', createPost);
router.get('/posts/:id/', getPostById);
router.get('/posts', getAllPosts);
// router.delete('/post/:id')
export default router;
