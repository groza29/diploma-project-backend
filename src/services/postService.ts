import { Post } from '../models/postModel';
import { v4 as uuidv4 } from 'uuid';
import { PostRepository } from '../repositories/postRepository';
import { User } from '../models/userModel';
import { CustomError } from '../utils/CustomError';
import { UserRepository } from '../repositories/userRepository';

const postRepository = new PostRepository();
const userRepository = new UserRepository();

export class PostService {
  async createPost(post: Post): Promise<void> {
    const result = await userRepository.getUserById(post.user_id);
    if (result as User) {
      post.id = uuidv4();
      post.createdAt = Date.now();
      await postRepository.addPost(post);
    } else {
      throw new CustomError('Internal Error', 500);
    }
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
