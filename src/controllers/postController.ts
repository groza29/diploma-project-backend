import { Post } from '../models/postModel';
import { v4 as uuidv4 } from 'uuid';
import { PostService } from '../services/postService';
import { Request, Response } from 'express';

const postService = new PostService();

export const createPost = async (req: Request, res: Response) => {
  try {
    const post: Post = req.body;
    post.id = uuidv4();
    await postService.createPost(post);
    res.status(200).json({ message: 'Post created' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post: Post | null = await postService.getPostById(req.params.id);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts: Post[] | null = await postService.getAllPosts();
    if (posts) {
      res.json(posts);
    } else {
      res.json(404).json({ message: 'There are no posts' });
    }
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};
