import { User, UserWithJobs } from '../models/userModel';
import docClient from '../config/db';
import { PutCommand, GetCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { formatUser } from '../utils/scanFormator';
import { CustomError } from '../utils/CustomError';
import stream from 'stream';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import s3 from '../config/s3Config';
dotenv.config();

export class UserRepository {
  private tableName = 'Users';
  private bucketName = process.env.S3_BUCKET_NAME!;

  async addUser(user: User): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: user,
    };
    try {
      await docClient.send(new PutCommand(params));
    } catch (error) {
      console.error(error);
      throw new CustomError('Database error', 500);
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: { id: userId },
    };
    try {
      const result = await docClient.send(new GetCommand(params));

      return (result.Item as User) || null;
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
  async getUserByEmail(email: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': { S: email },
      },
    };
    try {
      const result = await docClient.send(new QueryCommand(params));

      if (!result.Items || result.Items.length === 0) {
        return null;
      }
      return (formatUser(result.Items?.[0]) as User) || null;
    } catch (error) {
      console.error(error);
      throw new CustomError('Database error', 500);
    }
  }
  async deleteUserById(userId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id: userId },
    };
    try {
      await docClient.send(new DeleteCommand(params));
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }

  async getAllUsers(): Promise<User[]> {
    const params = {
      TableName: this.tableName,
    };
    try {
      const data = await docClient.send(new ScanCommand(params));
      return data.Items?.map(formatUser) as User[];
    } catch (error) {
      throw new CustomError('error fetching all the users', 500);
    }
  }

  async updateUser(id: string, updates: Partial<User>): Promise<void> {
    let updateExpression = 'SET';
    const expressionAttributeNames: any = {};
    const expressionAttributeValues: any = {};

    Object.keys(updates).forEach((key, index) => {
      const field = `#field${index}`;
      const value = `:value${index}`;

      updateExpression += ` ${field} = ${value},`;
      expressionAttributeNames[field] = key;
      expressionAttributeValues[value] = updates[key as keyof User];
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
      throw new CustomError('Database error', 500);
    }
  }
  async getAvatar(id: string): Promise<stream.Readable | null> {
    const key = `avatars/${id}.jpg`;
    try {
      const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
      const response = await s3.send(command);
      return response.Body as stream.Readable;
    } catch (error) {
      console.error('Error retrieving avatar:', error);
      return null;
    }
  }
}
