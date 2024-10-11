import { Post } from '../models/postModel';
import { v4 as uuidv4 } from 'uuid';
import { PostRepository } from '../repositories/postRepository';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import { User } from '../models/userModel';
import docClient from '../config/db';

const postRepository = new PostRepository();
export class PostService {
  async createPost(post: Post): Promise<void> {
    const result = await docClient.send(
      new GetCommand({
        TableName: 'Users',
        Key: {
          id: post.user_id,
        },
      }),
    );
    if (result.Item as User) {
      post.id = uuidv4();
      post.createdAt = new Date().toString();
      await postRepository.addPost(post);
    }
  }
  async getPostById(id: string): Promise<Post> {
    const post: Post | null = await postRepository.getPostById(id);
    if (post) {
      return post;
    } else {
      throw new Error('Post not found');
    }
  }
  async getAllPosts(): Promise<Post[]> {
    return await postRepository.getAllPosts();
  }
  async deletePostById(postID: string): Promise<void> {
    await postRepository.deletePostById(postID);
  }
  async updatePost(postID: string, post: Partial<Post>): Promise<void> {
    try {
      await postRepository.updatePost(postID, post);
    } catch (err) {
      throw new Error(`Failed to update post: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  }
}
