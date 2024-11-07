import { Type } from './JobTypeEnum';

export interface Job {
  id: string;
  type: Type;
  departament: string;
  name: string;
}
