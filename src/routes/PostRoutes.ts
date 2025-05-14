import { Router } from 'express';
import {
  createPost,
  deletePostById,
  getAllPosts,
  getAllPostsOfAnUser,
  getPostById,
  updatePost,
} from '../controllers/postController';
import uploadPost from '../middlewares/uploadPostImages';

const router = Router();

router.post('/posts', uploadPost.array('files'), createPost);
router.get('/posts/user/:user_id', getAllPostsOfAnUser);
router.delete('/posts/:id', deletePostById);
router.get('/posts/:id/', getPostById);
router.get('/posts', getAllPosts);
router.put('/posts/:id', uploadPost.array('files'), updatePost);

export default router;
