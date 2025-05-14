import { Post } from '../models/postModel';
import { PostService } from '../services/postService';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';

const postService = new PostService();

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const newPost = await postService.createPost(req.body, req.files as Express.Multer.File[]);
  res.status(201).json({
    message: 'Post created',
    data: newPost,
  });
});

export const getPostById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const post: Post = await postService.getPostById(req.params.id);
  res.status(200).json(post);
});

export const getAllPosts = asyncHandler(async (req: Request, res: Response) => {
  const posts: Post[] = await postService.getAllPosts();
  res.status(200).json(posts);
});

export const deletePostById = asyncHandler(async (req: Request, res: Response) => {
  await postService.deletePostById(req.params.id);
  res.status(204).send('Post deleted');
});
export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  await postService.updatePost(req.params.id, req.body);
  res.status(205).json({ message: 'Post updated' });
});
export const getAllPostsOfAnUser = asyncHandler(async (req: Request, res: Response) => {
  const posts: Post[] = await postService.getAllPostsOfAnUser(req.params.user_id);
  res.status(200).json(posts);
});
