import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post, Req, UseFilters } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { ApplicationServiceURL } from './app.config';
import { AxiosExceptionFilter } from './filters/axios-exception.filter';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@UseFilters(AxiosExceptionFilter)
export class UsersController {
  constructor(
    private readonly httpService: HttpService
  ) {}

  @Post('register')
  public async create(@Body() createUserDto:CreateUserDto){
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/register`, createUserDto);
    return data;
  }

  @Post('login')
  public async login(@Body() loginUserDto: LoginUserDto) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/login`, loginUserDto);
    return data;
  }

  @Post('refresh')
  public async refreshToken(@Req() req: Request) {
    const { data } = await this.httpService.axiosRef.post(`${ApplicationServiceURL.Users}/refresh`, null, {
      headers: {
        'Authorization': req.headers['authorization']
      }
    });
    return data;
  }
}
