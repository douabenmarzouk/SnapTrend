export interface User {
avatar: any;
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  website?: string;
  followers: number;
  following: number;
  pins: number;
  createdAt: Date;
}