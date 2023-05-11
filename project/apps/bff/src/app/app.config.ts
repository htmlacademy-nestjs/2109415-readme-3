export enum ApplicationServiceURL {
  Users = 'http://localhost:3000/api/auth',
  Blog = 'http://localhost:3333/api/posts',
  Comments = 'http://localhost:3333/api/comment',
  Tags = 'http://localhost:3333/api/tags',
  Files = 'http://localhost:3338/api/files',
}

export const HTTP_CLIENT_MAX_REDIRECTS = 5;
export const HTTP_CLIENT_TIMEOUT = 5000;
