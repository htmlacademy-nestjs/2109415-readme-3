import { Comment } from './comment.interface';
import { Favorite } from './favorite.interface';
import { PostType } from './post-type.enum';
import { Tag } from './tag.interface';

export interface PostEntity {
  id?: number;
  tags?: Tag[];
  postType: PostType;
  createdAt?: Date;
  publishAt?: Date;
  userId?: string;
  videoPost?: VideoPostBody;
  textPost?: TextPostBody;
  quotePost?: QuotePostBody;
  picturePost?: PicturePostBody;
  linkPost?: LinkPostBody;
  comments: Comment[];
  favorite: Favorite[];
  isDraft: boolean;
  originalPostId?: number;
}

export interface VideoPostBody {
  id?: number;
  title: string;
  linkVideo: string;
}

export interface TextPostBody {
  id?: number;
  name: string;
  announcement: string;
  text: string;
}

export interface QuotePostBody {
  id?: number;
  text: string;
  autor: string;
}

export interface PicturePostBody {
  id?: number;
  picture: string;
}

export interface LinkPostBody {
  id?: number;
  link: string;
  options?: string;
}
