import { User } from '../models/userModel';
import docClient from '../config/db';
import { PutCommand, GetCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { formatUser } from '../utils/scanFormator';
import { CustomError } from '../utils/CustomError';

export class UserRepository {
  private tableName = 'Users';

  async addUser(user: User): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: user,
    };
    try {
      await docClient.send(new PutCommand(params));
    } catch (error) {
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
      return (result.Items?.[0] as unknown as User) || null;
    } catch (error) {
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
}
