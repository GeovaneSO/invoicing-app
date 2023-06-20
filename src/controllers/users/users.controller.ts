import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateUserDto,
  RecoverPassDto,
  UpdateUserDto,
  UserListResponseDto,
  UserRecoveryPasswordDto,
  UserResponseDto,
} from 'src/dtos/user.dto';
import { UsersService } from 'src/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersServices: UsersService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  public async create(@Body() data: CreateUserDto): Promise<object> {
    await this.usersServices.createUser(data);
    return {
      message: 'Cadastro realizado com sucesso',
    };
  }

  @Get()
  public async getAll(): Promise<UserListResponseDto> {
    return await this.usersServices.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public async getOne(@Param('id') id: string): Promise<UserResponseDto> {
    return await this.usersServices.findById(id);
  }

  @Patch('')
  async confirmEmailWithToken(@Query('token') token: string): Promise<object> {
    return await this.usersServices.confirmEmailWithToken(token);
  }

  @Post('/send-email-recover')
  @HttpCode(200)
  async sendEmailRecover(@Body() data: RecoverPassDto): Promise<object> {
    return await this.usersServices.sendEmailRecoverPassword(data);
  }

  @Patch('/recover')
  @HttpCode(200)
  async recoverPass(@Body() data: UserRecoveryPasswordDto): Promise<object> {
    return await this.usersServices.recoverPass(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  public async update(
    @Body() data: UpdateUserDto,
    @Param('id') id: string,
  ): Promise<UserResponseDto> {
    return await this.usersServices.updateUser(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  @HttpCode(200)
  public async delete(@Param('id') id: string): Promise<object> {
    return await this.usersServices.deleteUser(id);
  }
}
