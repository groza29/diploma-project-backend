import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../config/db';
import { Post } from '../models/postModel';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { formatPost } from '../utils/scanFormator';
import { User } from '../models/userModel';

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
  async deletePostById(postId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id: postId },
    };
    await docClient.send(new DeleteCommand(params));
  }
  async updatePost(id: string, updates: Partial<Post>): Promise<void> {
    let updateExpression = 'SET';
    const expressionAttributeNames: any = {};
    const expressionAttributeValues: any = {};

    Object.keys(updates).forEach((key, index) => {
      const field = `#field${index}`;
      const value = `:value${index}`;

      updateExpression += ` ${field} = ${value},`;
      expressionAttributeNames[field] = key;
      expressionAttributeValues[value] = updates[key as keyof Post];
    });

    updateExpression = updateExpression.slice(0, -1);

    const params = {
      TableName: this.tableName,
      Key: { id: id },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
    };
    await docClient.send(new UpdateCommand(params));
  }
}
