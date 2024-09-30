import { User } from '../models/userModel';
import docClient from '../config/db';
import { PutCommand, GetCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { formatUser } from '../utils/scanFormator';

export class UserRepository {
  private tableName = 'Users';

  async addUser(user: User): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: user,
    };
    await docClient.send(new PutCommand(params));
  }

  async getUserById(userId: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: { id: userId },
    };
    const result = await docClient.send(new GetCommand(params));
    return (result.Item as User) || null;
  }
  async deleteUserById(userId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id: userId },
    };
    await docClient.send(new DeleteCommand(params));
  }

  async getAllUsers(): Promise<User[]> {
    const params = {
      TableName: this.tableName,
    };
    try {
      const data = await docClient.send(new ScanCommand(params));
      return data.Items?.map(formatUser) as User[];
    } catch (error) {
      console.error('error fetching all users: ', error);
      throw new Error();
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
    await docClient.send(new UpdateCommand(params));
  }
}
