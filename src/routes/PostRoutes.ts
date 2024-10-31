import { Router } from 'express';
import {
  createPost,
  deletePostById,
  getAllPosts,
  getAllPostsOfAnUser,
  getPostById,
  updatePost,
} from '../controllers/postController';

const router = Router();

router.post('/posts', createPost);
router.get('/posts/user/:user_id', getAllPostsOfAnUser);
router.delete('/posts/:id', deletePostById);
router.get('/posts/:id/', getPostById);
router.get('/posts', getAllPosts);
router.put('/posts/:id', updatePost);
export default router;
