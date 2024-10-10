export interface Post {
  id: string;
  title: string;
  body: string;
  user_id: string;
  actionDate: Date;
  status: boolean;
  createdAt: Date | string;
}
