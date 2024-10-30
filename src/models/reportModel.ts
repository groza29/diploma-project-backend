export interface Report {
  id: string;
  type: 'user' | 'post';
  id_reported: string;
  message: string;
  createdAt: Date | string;
  status: 'OPEN' | 'IN PROGRESS' | 'CLOSED';
}
