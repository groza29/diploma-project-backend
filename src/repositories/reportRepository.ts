import { DeleteCommand, GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import docClient from '../config/db';
import { Report } from '../models/reportModel';
import { CustomError } from '../utils/CustomError';
import { QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { formatReport } from '../utils/scanFormator';

export class ReportRepository {
  private tableName = 'Reports';

  async addReport(report: Report): Promise<void> {
    const params = {
      TableName: this.tableName,
      Item: report,
    };
    try {
      await docClient.send(new PutCommand(params));
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
  async getReportById(reportId: string): Promise<Report | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: reportId,
      },
    };
    try {
      const result = await docClient.send(new GetCommand(params));
      return (result.Item as Report) || null;
    } catch {
      throw new CustomError('Database error', 500);
    }
  }
  async getAllReports(): Promise<Report[]> {
    const params = {
      TableName: this.tableName,
    };
    try {
      const reports = await docClient.send(new ScanCommand(params));
      return reports.Items?.map(formatReport) as Report[];
    } catch (error) {
      throw new CustomError('Database Error', 500);
    }
  }
  async deleteReportById(reportId: string): Promise<void> {
    const params = {
      TableName: this.tableName,
      Key: {
        id: reportId,
      },
    };
    try {
      await docClient.send(new DeleteCommand(params));
    } catch (error) {
      throw new CustomError('Database Error', 500);
    }
  }
  async updateReport(id: string, updates: Partial<Report>): Promise<void> {
    let updateExpression = 'SET';
    const expressionAttributeNames: any = {};
    const expressionAttributeValues: any = {};

    Object.keys(updates).forEach((key, index) => {
      const field = `#field${index}`;
      const value = `:value${index}`;

      updateExpression += ` ${field} = ${value},`;
      expressionAttributeNames[field] = key;
      expressionAttributeValues[value] = updates[key as keyof Report];
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
  async getReportsByStatus(status: string): Promise<Report[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'StatusIndex',
      KeyConditionExpression: '#status = :status',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': { S: status },
      },
    };
    try {
      const result = await docClient.send(new QueryCommand(params));
      console.log(result);
      return (result.Items?.map(formatReport) as Report[]) || null;
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
  async getReportsForAnId(id_reported: string): Promise<Report[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'IdReportedIndex',
      KeyConditionExpression: '#id_reported = :id_reported',
      ExpressionAttributeNames: {
        '#id_reported': 'id_reported',
      },
      ExpressionAttributeValues: {
        ':id_reported': { S: id_reported },
      },
    };
    try {
      const result = await docClient.send(new QueryCommand(params));
      return (result.Items?.map(formatReport) as Report[]) || null;
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
  async getReportsByType(type: string): Promise<Report[]> {
    const params = {
      TableName: this.tableName,
      IndexName: 'TypeIndex',
      KeyConditionExpression: '#type = :type',
      ExpressionAttributeNames: {
        '#type': 'type',
      },
      ExpressionAttributeValues: {
        ':type': { S: type },
      },
    };
    try {
      const result = await docClient.send(new QueryCommand(params));
      return (result.Items?.map(formatReport) as Report[]) || null;
    } catch (error) {
      throw new CustomError('Database error', 500);
    }
  }
}
