import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { ApplicationServiceURL } from './app.config';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { CheckAuthGuard } from './guards/check-auth.guard';
import { RequestWithTokenPayload } from '@project/shared/app-types';
import { NewPassDto } from './dto/new-pass.dto';

@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(private readonly httpService: HttpService) {}

  @Post('register')
  public async create(@Body() createUserDto: CreateUserDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/register`,
      createUserDto
    );
    return data;
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/login`,
      loginUserDto
    );
    return data;
  }

  @Post('refresh')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/refresh`,
      null,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post('check')
  public async check(@Req() { user: payload }: RequestWithTokenPayload) {
    return payload;
  }

  @UseGuards(CheckAuthGuard)
  @Post('changepassword')
  public async changePass(
    @Body() dto: NewPassDto,
    @Req() { user: payload }: RequestWithTokenPayload
  ) {
    const body = { ...dto, id: payload.sub };
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/changepassword`,
      body
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post('subcribe/:id')
  public async subcribe(@Param('id') id: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/subcribe/${id}`,
      null,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
    return data;
  }

  @UseGuards(CheckAuthGuard)
  @Post('unsubcribe/:id')
  public async ubSubcribe(@Param('id') id: string, @Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(
      `${ApplicationServiceURL.Users}/unsubcribe/${id}`,
      null,
      {
        headers: {
          Authorization: req.headers['authorization'],
        },
      }
    );
    return data;
  }
}
