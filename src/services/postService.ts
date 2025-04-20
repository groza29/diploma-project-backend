import { Post } from '../models/postModel';
import { v4 as uuidv4 } from 'uuid';
import { PostRepository } from '../repositories/postRepository';
import { CustomError } from '../utils/CustomError';
import { UserRepository } from '../repositories/userRepository';
import s3 from '../config/s3Config';
import dotenv from 'dotenv';
import { PutObjectCommand } from '@aws-sdk/client-s3';
dotenv.config();

const postRepository = new PostRepository();
const userRepository = new UserRepository();

export class PostService {
  async createPost(postData: any, files: Express.Multer.File[]): Promise<void> {
    const user = await userRepository.getUserById(postData.user_id);
    if (!user) throw new CustomError('User not found', 404);

    const newPost: Post = {
      ...postData,
      id: uuidv4(),
      createdAt: Date.now(),
      status: true,
    };

    const imageUrls: string[] = [];

    for (const file of files) {
      const key = `posts/${newPost.id}/${file.originalname}`;

      const command = new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await s3.send(command);

      imageUrls.push(`https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${key}`);
    }

    (newPost as any).images = imageUrls;
    if (newPost.jobs?.length === 0) {
      delete newPost.jobs;
    }
    await postRepository.addPost(newPost);
  }

  async getPostById(id: string): Promise<Post> {
    const post: Post | null = await postRepository.getPostById(id);
    if (post) {
      return post;
    } else {
      throw new CustomError('Post not found', 404);
    }
  }
  async getAllPosts(): Promise<Post[]> {
    return await postRepository.getAllPosts();
  }
  async deletePostById(postID: string): Promise<void> {
    await postRepository.deletePostById(postID);
  }
  async updatePost(postID: string, post: Partial<Post>): Promise<void> {
    await postRepository.updatePost(postID, post);
  }
  async getAllPostsOfAnUser(user_id: string): Promise<Post[]> {
    return await postRepository.getAllPostsOfAnUser(user_id);
  }
}
