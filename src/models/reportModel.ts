import { Status } from './StatusEnum';
import { Type } from './TypeEnum';

export interface Report {
  id: string;
  type: Type;
  id_reported: string;
  message: string;
  createdAt: number;
  status: Status;
}
