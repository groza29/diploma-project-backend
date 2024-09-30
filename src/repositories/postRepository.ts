import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../config/db';
import { Post } from '../models/postModel';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { formatPost } from '../utils/scanFormator';

export class PostRepository {
  private tableName = 'Posts';

  async addPost(post: Post) {
    const params = {
      TableName: this.tableName,
      Item: post,
    };
    await docClient.send(new PutCommand(params));
  }
  async getPostById(postId: string): Promise<Post | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: postId,
      },
    };
    const result = await docClient.send(new GetCommand(params));
    return (result.Item as Post) || null;
  }
  async getAllPosts(): Promise<Post[]> {
    const params = {
      TableName: this.tableName,
    };
    try {
      const posts = await docClient.send(new ScanCommand(params));
      return posts.Items?.map(formatPost) as Post[];
    } catch (error) {
      console.error('error fetching all posts: ', error);
      throw new Error();
    }
  }
}
