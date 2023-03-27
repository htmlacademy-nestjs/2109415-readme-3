import { User, UserRole } from '@project/shared/app-types';

export class BlogUserEntity implements User {
  public _id: string;
  public avatar: string;
  public dateRegistration: Date;
  public email: string;
  public firstname: string;
  public lastname: string;
  public passwordHash: string;
  public role: UserRole;

  constructor(blogUser: User) {
    this.fillEntity(blogUser);
  }

  public toObject() {
    return {...this};
  }

  public fillEntity(blogUser: User) {
    this._id = blogUser._id;
    this.avatar = blogUser.avatar;
    this.dateRegistration = blogUser.dateRegistration;
    this.email = blogUser.email;
    this.firstname = blogUser.firstname;
    this.lastname = blogUser.lastname;
    this.passwordHash = blogUser.passwordHash;
    this.role = blogUser.role;
  }
}
