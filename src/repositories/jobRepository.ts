import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../config/db';
import { Job } from '../models/jobModel';
import { CustomError } from '../utils/CustomError';
import { QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { formatJob } from '../utils/scanFormator';

export class JobRepository {
  private tableName = 'Jobs';
  async createJob(job: Job): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: job,
    };
    try {
      await docClient.send(new PutCommand(params));
    } catch (error) {
      throw new CustomError('Database error ', 500);
    }
  }
  async getAllJobs(): Promise<Job[]> {
    const params = {
      TableName: this.tableName,
    };
    try {
      const jobs = await docClient.send(new ScanCommand(params));
      return jobs.Items?.map(formatJob) as Job[];
    } catch (error) {
      console.log(error);
      throw new CustomError('Database error', 500);
    }
  }
  async getJobById(id: string): Promise<Job> {
    const params = {
      TableName: this.tableName,
      Key: { id: id },
    };
    try {
      const result = await docClient.send(new GetCommand(params));
      return (result.Item as Job) || null;
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
  async deleteJobById(id: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: { id: id },
    };
    try {
      await docClient.send(new DeleteCommand(params));
    } catch (error) {
      throw new CustomError('Database Error', 500);
    }
  }
  async updateJob(id: string, updates: Partial<Job>): Promise<void> {
    let updateExpression = 'SET';
    const expressionAttributeNames: any = {};
    const expressionAttributeValues: any = {};

    Object.keys(updates).forEach((key, index) => {
      const field = `#field${index}`;
      const value = `:value${index}`;

      updateExpression += ` ${field} = ${value},`;
      expressionAttributeNames[field] = key;
      expressionAttributeValues[value] = updates[key as keyof Job];
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
  async getJobsByDepartament(departament: string): Promise<Job[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'DepartamentIndex',
      KeyConditionExpression: '#departament = :departament',
      ExpressionAttributeNames: {
        '#departament': 'departament',
      },
      ExpressionAttributeValues: {
        ':departament': { S: departament },
      },
    };
    try {
      const result = await docClient.send(new QueryCommand(params));
      return (result.Items?.map(formatJob) as Job[]) || null;
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
}
