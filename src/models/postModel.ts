export interface Post {
  id: string;
  title: string;
  body: string;
  user_id: string;
  actionDate: Date;
  status: boolean;
  jobs?: string[];
  createdAt: number;
  imagesUrls?: string[];
  country: string;
  county: string;
  city: string;
}
