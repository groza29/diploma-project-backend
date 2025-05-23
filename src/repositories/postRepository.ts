import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../config/db';
import { Post } from '../models/postModel';
import { QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { formatPost, formatScanPost } from '../utils/scanFormator';
import { CustomError } from '../utils/CustomError';

export class PostRepository {
  private tableName = 'Posts';
  async addPost(post: Post): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: post,
    };
    try {
      await docClient.send(new PutCommand(params));
    } catch (error) {
      throw new CustomError(`Database error: ${error}`, 500);
    }
  }
  async getPostById(postId: string): Promise<Post | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: postId,
      },
    };
    try {
      const result = await docClient.send(new GetCommand(params));
      return (result.Item as Post) || null;
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
  async getAllPosts(): Promise<Post[]> {
    const params = {
      TableName: this.tableName,
    };
    try {
      const posts = await docClient.send(new ScanCommand(params));
      console.log(posts.Items);
      return posts.Items?.map(formatScanPost) as Post[];
    } catch (error) {
      throw new CustomError('error fetching all posts', 500);
    }
  }
  async deletePostById(postId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id: postId },
    };
    try {
      await docClient.send(new DeleteCommand(params));
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
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
    try {
      await docClient.send(new UpdateCommand(params));
    } catch (error) {
      throw new CustomError('Database error' + error, 500);
    }
  }
  async getAllPostsOfAnUser(user_id: string): Promise<Post[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'UserPostIndex',
      KeyConditionExpression: '#user_id = :user_id',
      ExpressionAttributeNames: {
        '#user_id': 'user_id',
      },
      ExpressionAttributeValues: {
        ':user_id': { S: user_id },
      },
    };
    try {
      const result = await docClient.send(new QueryCommand(params));
      return result.Items?.map(formatPost) as Post[];
    } catch (error) {
      throw new CustomError('Database error:' + error, 500);
    }
  }

  async getUserPostsPaginated(userId: string, lastKey?: any, limit = 6): Promise<any> {
    const params: any = {
      TableName: this.tableName!,
      IndexName: 'UserPostIndex',
      KeyConditionExpression: 'user_id = :uid',
      ExpressionAttributeValues: {
        ':uid': { S: userId },
      },
      Limit: limit,
      ScanIndexForward: false,
    };

    if (lastKey) {
      params.ExclusiveStartKey = lastKey;
    }

    try {
      const data = await docClient.send(new QueryCommand(params));
      const posts = data.Items?.map((item) => formatPost(item)) || [];
      return {
        posts,
        lastKey: data.LastEvaluatedKey || null,
      };
    } catch (error) {
      console.error('Error querying posts:', error);
      throw new Error('Database error');
    }
  }
}
