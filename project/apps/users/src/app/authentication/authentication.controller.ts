import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { UserRdo } from './rdo/user.rdo';
import { CreateUserDto } from './dto/create-user.dto';
import { fillObject } from '@project/util/util-core';
import { LoggedUserRdo } from './rdo/logged-user.rdo';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MongoidValidationPipe } from '@project/shared/shared-pipes';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { NotifyService } from '../notify/notify.service';
import {
  RequestWithTokenPayload,
  RequestWithUser,
} from '@project/shared/app-types';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { changePassDto } from './dto/change-pass.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authService: AuthenticationService,
    private readonly notifyService: NotifyService
  ) {}

  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The new user has been successfully created.',
  })
  @Post('register')
  public async create(@Body() dto: CreateUserDto) {
    const newUser = await this.authService.register(dto);
    const { email, firstname, lastname } = newUser;
    await this.notifyService.registerSubscriber({ email, firstname, lastname });
    return fillObject(UserRdo, newUser);
  }

  @Post('changepassword')
  public async newPass(@Body() dto: changePassDto) {
    const { id, oldPassword, newPassword } = dto;
    return this.authService.changePassword(id, oldPassword, newPassword);
  }

  @UseGuards(LocalAuthGuard)
  @ApiResponse({
    type: LoggedUserRdo,
    status: HttpStatus.OK,
    description: 'User has been successfully logged.',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Password or Login is wrong.',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(@Req() { user }: RequestWithUser) {
    return this.authService.createUserToken(user);
  }

  @Post('addpost/:id')
  public async decreasePostsQtt(
    @Param('id', MongoidValidationPipe) id: string
  ) {
    const existUser = await this.authService.increasePostsQtt(id);
    return fillObject(UserRdo, existUser);
  }
  @Post('delpost/:id')
  public async increasePostsQtt(
    @Param('id', MongoidValidationPipe) id: string
  ) {
    const existUser = await this.authService.decreasePostsQtt(id);
    return fillObject(UserRdo, existUser);
  }

  @ApiResponse({
    type: UserRdo,
    status: HttpStatus.OK,
    description: 'User found',
  })
  @Get(':id')
  public async show(@Param('id', MongoidValidationPipe) id: string) {
    const existUser = await this.authService.getUser(id);
    return fillObject(UserRdo, existUser);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get a new access/refresh tokens',
  })
  public async refreshToken(@Req() { user }: RequestWithUser) {
    return this.authService.createUserToken(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('check')
  public async checkToken(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }

  @UseGuards(JwtAuthGuard)
  @Post('subcribe/:id')
  public async subcribe(
    @Req() { user: payload }: RequestWithTokenPayload,
    @Param('id', MongoidValidationPipe) id: string
  ) {
    return this.authService.subscribe(payload.sub, id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('unsubcribe/:id')
  public async unsubcribe(
    @Req() { user: payload }: RequestWithTokenPayload,
    @Param('id', MongoidValidationPipe) id: string
  ) {
    return this.authService.unSubscribe(payload.sub, id);
  }
}
