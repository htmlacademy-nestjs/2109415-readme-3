import { PostType } from "./post-type.enum";
import { User } from "./user.interface";

export interface Post {
  _id?: string,
  tag?: string[],
  type: PostType,
  user: User,
}

export interface VideoPost extends Post {
  name: string,
  video: string,
}

export interface TextPost extends Post {
  name: string,
  announcement: string,
  text: string,
}

export interface QuotePost extends Post {
  name: string,
  autor: string,
}

export interface PicturePost extends Post {
  picture: string,
}

export interface LinkPost extends Post {
  link: string,
  options?: string,
}
