import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateUserDto,
  UpdateUserDto,
  UserListResponseDto,
  UserResponseDto,
} from 'src/dtos/user.dto';
import { UsersService } from 'src/services/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersServices: UsersService) {}

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  public async create(@Body() data: CreateUserDto): Promise<UserResponseDto> {
    return await this.usersServices.createUser(data);
  }

  @Get()
  public async getAll(): Promise<UserListResponseDto> {
    return await this.usersServices.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  public async getOne(
    @Param('id') id: string,
    @Request() req,
  ): Promise<UserResponseDto> {
    console.log(req.user);

    return await this.usersServices.findById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  public async update(
    @Body() data: UpdateUserDto,
    @Param('id') id: string,
    @Request() req,
  ): Promise<UserResponseDto> {
    console.log(req.user);

    return await this.usersServices.updateUser(id, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<object> {
    return await this.usersServices.deleteUser(id);
  }
}
