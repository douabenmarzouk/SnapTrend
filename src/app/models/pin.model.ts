export interface Pin {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  board?: string;
  author: {
avatar: any;
    id: string;
    name: string;
  };
  saves: number;
  createdAt: Date;
  tags: string[];
  width?: number;
  height?: number;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  pins: Pin[];
  coverImage: string;
  isPrivate: boolean;
  createdAt: Date;
}

export interface CreatePinRequest {
  title: string;
  description: string;
  image: string;
  link?: string;
  board?: string;
  tags: string[];
}