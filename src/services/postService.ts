import { Post } from '../models/postModel';
import { PostRepository } from '../repositories/postRepository';

const postRepository = new PostRepository();
export class PostService {
  async createPost(post: Post): Promise<void> {
    await postRepository.addPost(post);
  }
  async getPostById(id: string): Promise<Post | null> {
    return await postRepository.getPostById(id);
  }
  async getAllPosts(): Promise<Post[]> {
    return await postRepository.getAllPosts();
  }
}
