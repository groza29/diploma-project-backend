export interface Application {
  id: string;
  user_id: string;
  post_id: string;
  message: string;
  status: boolean;
  accepted: boolean;
  createdAt: number;
}
