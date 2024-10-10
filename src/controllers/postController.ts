import { Post } from '../models/postModel';
import { PostService } from '../services/postService';
import { Request, Response } from 'express';

const postService = new PostService();

export const createPost = async (req: Request, res: Response) => {
  try {
    await postService.createPost(req.body);
    res.status(200).json({ message: 'Post created' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post: Post = await postService.getPostById(req.params.id);
    res.json(post);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'Post not found') {
        res.status(404).json({ error: err.message });
      }
      res.status(500).json({ error: err.message });
    }
  }
};
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts: Post[] = await postService.getAllPosts();
    res.json(posts);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};

export const deletePostById = async (req: Request, res: Response) => {
  try {
    await postService.deletePostById(req.params.id);
    res.status(204).send('post deleted');
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};
export const updatePost = async (req: Request, res: Response) => {
  try {
    await postService.updatePost(req.params.id, req.body);
    res.json({ message: 'Post updated' });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    }
  }
};
