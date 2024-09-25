import { User } from '../models/userModel';
import docClient from '../config/db';
import { PutCommand, GetCommand, DeleteCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { formatUser } from '../utils/formatUser';

export class UserRepository {
  private tableName = 'Users';

  async addUser(user: User): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: user,
    };
    await docClient.send(new PutCommand(params));
  }

  async getUserById(userId: string, firstName: string): Promise<User | null> {
    const params = {
      TableName: this.tableName,
      Key: { id: userId, firstName: firstName },
    };
    const result = await docClient.send(new GetCommand(params));
    return (result.Item as User) || null;
  }
  async deleteUserById(userId: string, firstName: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id: userId, firstName: firstName },
    };
    await docClient.send(new DeleteCommand(params));
  }
  // async updateUser(userId: string, name: string): Promise<void> {
  //   const params = {
  //     TableName: this.tableName,
  //     Key: { Id: userId },
  //     UpdateExpression: 'set #n = :name',
  //     ExpressionAttributeNames: { '#n': 'Name' },
  //     ExpressionAttributeValues: { ':name': name },
  //   };
  //   await docClient.send(new UpdateCommand(params));
  // }
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
}
