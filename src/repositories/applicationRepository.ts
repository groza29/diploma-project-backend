import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../config/db';
import { Application } from '../models/applicationModel';
import { CustomError } from '../utils/CustomError';
import { QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { formatApplication } from '../utils/scanFormator';

export class ApplicationRepository {
  private tableName = 'Applications';
  async createApplication(applcation: Application): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: applcation,
    };
    try {
      await docClient.send(new PutCommand(params));
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
  async getApplicationById(id: string): Promise<Application> {
    const params = {
      TableName: this.tableName,
      Key: { id: id },
    };
    try {
      const result = await docClient.send(new GetCommand(params));
      return (result.Item as Application) || null;
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
  async getAllApplications(): Promise<Application[]> {
    const params = {
      TableName: this.tableName,
    };
    try {
      const applications = await docClient.send(new ScanCommand(params));
      return applications.Items?.map(formatApplication) as Application[];
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
  async deleteApplicationById(id_application: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id: id_application },
    };
    try {
      await docClient.send(new DeleteCommand(params));
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
  async updateApplication(id: string, updates: Partial<Application>): Promise<void> {
    let updateExpression = 'SET';
    const expressionAttributeNames: any = {};
    const expressionAttributeValues: any = {};

    Object.keys(updates).forEach((key, index) => {
      const val = updates[key as keyof Application];
      if (val === undefined) return;

      const field = `#field${index}`;
      const value = `:value${index}`;

      updateExpression += ` ${field} = ${value},`;
      expressionAttributeNames[field] = key;
      expressionAttributeValues[value] = val;
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
      console.log(error);
      throw new CustomError('Database error', 500);
    }
  }
  async getApplicationsOnAPost(post_id: string): Promise<Application[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'PostIndex',
      KeyConditionExpression: '#post_id = :post_id',
      ExpressionAttributeNames: {
        '#post_id': 'post_id',
      },
      ExpressionAttributeValues: {
        ':post_id': { S: post_id },
      },
    };
    try {
      const result = await docClient.send(new QueryCommand(params));
      return result.Items?.map(formatApplication) as Application[];
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
  async getApplicationsOfAnUser(user_id: string): Promise<Application[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'UserIndex',
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
      return result.Items?.map(formatApplication) as Application[];
    } catch (error) {
      console.log(error);
      throw new CustomError('Database error', 500);
    }
  }
  async getApplicationByPostAndUser(post_id: string, user_id: string): Promise<Application[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'ApplicationIndex',
      KeyConditionExpression: '#post_id = :post_id AND #user_id = :user_id',
      ExpressionAttributeNames: {
        '#post_id': 'post_id',
        '#user_id': 'user_id',
      },
      ExpressionAttributeValues: {
        ':post_id': { S: post_id },
        ':user_id': { S: user_id },
      },
    };

    try {
      const result = await docClient.send(new QueryCommand(params));
      return result.Items?.map(formatApplication) as Application[];
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
}
