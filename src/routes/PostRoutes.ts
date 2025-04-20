import { Router } from 'express';
import {
  createPost,
  deletePostById,
  getAllPosts,
  getAllPostsOfAnUser,
  getPostById,
  updatePost,
} from '../controllers/postController';
import uploadPostImages from '../middlewares/uploadPostImages';

const router = Router();

router.post('/posts', uploadPostImages.array('files'), createPost);
router.get('/posts/user/:user_id', getAllPostsOfAnUser);
router.delete('/posts/:id', deletePostById);
router.get('/posts/:id/', getPostById);
router.get('/posts', getAllPosts);
router.put('/posts/:id', updatePost);
export default router;
