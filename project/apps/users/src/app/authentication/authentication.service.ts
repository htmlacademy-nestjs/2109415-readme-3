import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRole } from '@project/shared/app-types';
import dayjs from 'dayjs';
import {
  AUTH_USER_EXISTS,
  AUTH_USER_NOT_FOUND,
  AUTH_USER_PASSWORD_WRONG,
} from './authentication.constant';
import { BlogUserEntity } from '../blog-user/blog-user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { jwtConfig } from '@project/config/config-users';
import { ConfigService, ConfigType } from '@nestjs/config';
import { BlogUserRepository } from '../blog-user/blog-user.repository';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { createJWTPayload } from '@project/util/util-core';
import * as crypto from 'node:crypto';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly blogUserRepository: BlogUserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtOptions: ConfigType<typeof jwtConfig>,
    private readonly refreshTokenService: RefreshTokenService
  ) {}
  public async register(dto: CreateUserDto): Promise<User> {
    const { email, firstname, lastname, password, dateBirth } = dto;

    const blogUser = {
      email,
      firstname,
      lastname,
      role: UserRole.User,
      avatar: '',
      dateBirth: dayjs(dateBirth).toDate(),
      passwordHash: '',
      subscribe: [],
      mySubscribers: [],
      myPostsQtt: 0,
    };

    const existUser = await this.blogUserRepository.findByEmail(email);

    if (existUser) {
      throw new ConflictException(AUTH_USER_EXISTS);
    }

    const userEntity = await new BlogUserEntity(blogUser).setPassword(password);

    return this.blogUserRepository.create(userEntity);
  }

  public async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string
  ): Promise<User> {
    const user = await this.blogUserRepository.findById(id);
    const newPasswordUserEntity = await new BlogUserEntity(user);
    if (!(await newPasswordUserEntity.comparePassword(oldPassword))) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }
    await newPasswordUserEntity.setPassword(newPassword);

    return this.blogUserRepository.update(id, newPasswordUserEntity);
  }

  public async verifyUser(dto: LoginUserDto) {
    const { email, password } = dto;
    const existUser = await this.blogUserRepository.findByEmail(email);

    if (!existUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }

    const blogUserEntity = new BlogUserEntity(existUser);
    if (!(await blogUserEntity.comparePassword(password))) {
      throw new UnauthorizedException(AUTH_USER_PASSWORD_WRONG);
    }

    return blogUserEntity.toObject();
  }

  public async getUser(id: string): Promise<User> {
    return this.blogUserRepository.findById(id);
  }

  public async createUserToken(user: User) {
    const accessTokenPayload = createJWTPayload(user);
    const refreshTokenPayload = {
      ...accessTokenPayload,
      tokenId: crypto.randomUUID(),
    };
    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    return {
      accessToken: await this.jwtService.signAsync(accessTokenPayload),
      refreshToken: await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.jwtOptions.refreshTokenSecret,
        expiresIn: this.jwtOptions.refreshTokenExpiresIn,
      }),
    };
  }

  public async increasePostsQtt(id: string): Promise<User> {
    const existUser = await this.blogUserRepository.findById(id);
    if (!existUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }
    existUser.myPostsQtt++;
    return await this.blogUserRepository.update(
      id,
      await new BlogUserEntity(existUser)
    );
  }

  public async decreasePostsQtt(id: string): Promise<User> {
    const existUser = await this.blogUserRepository.findById(id);
    if (!existUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }
    existUser.myPostsQtt--;
    return await this.blogUserRepository.update(
      id,
      await new BlogUserEntity(existUser)
    );
  }

  public async subscribe(idReader: string, idWriter: string): Promise<User> {
    const subscribingUser = await this.blogUserRepository.findById(idReader);
    if (!subscribingUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }
    if (!subscribingUser.subscribe.includes(idWriter)) {
      subscribingUser.subscribe.push(idWriter);
      await this.blogUserRepository.update(
        idReader,
        await new BlogUserEntity(subscribingUser)
      );
    }
    const subscribedUser = await this.blogUserRepository.findById(idWriter);
    if (!subscribedUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }
    if (!subscribedUser.mySubscribers.includes(idReader)) {
      subscribedUser.mySubscribers.push(idReader);
      return await this.blogUserRepository.update(
        idWriter,
        await new BlogUserEntity(subscribedUser)
      );
    }
  }

  public async unSubscribe(idReader: string, idWriter: string): Promise<User> {
    const subscribingUser = await this.blogUserRepository.findById(idReader);
    if (!subscribingUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }
    if (subscribingUser.subscribe.includes(idWriter)) {
      subscribingUser.subscribe.splice(
        subscribingUser.subscribe.indexOf(idWriter),
        1
      );
      await this.blogUserRepository.update(
        idReader,
        await new BlogUserEntity(subscribingUser)
      );
    }
    const subscribedUser = await this.blogUserRepository.findById(idWriter);
    if (!subscribedUser) {
      throw new NotFoundException(AUTH_USER_NOT_FOUND);
    }
    if (!subscribedUser.mySubscribers.includes(idReader)) {
      subscribedUser.mySubscribers.splice(
        subscribedUser.mySubscribers.indexOf(idReader),
        1
      );
      return await this.blogUserRepository.update(
        idWriter,
        await new BlogUserEntity(subscribedUser)
      );
    }
  }
}
