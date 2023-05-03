import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcryptjs from 'bcryptjs';
import { Model } from 'mongoose';
import {
  CreateUserDto,
  UserListResponseDto,
  UserResponseDto,
} from 'src/dtos/user.dto';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async createUser(data: CreateUserDto) {
    console.log(data);
    const hashPassword = await bcryptjs.hash(data.password, 10);

    const createdUser = await new this.model({
      password: hashPassword,
      name: data.name,
      email: data.email,
    }).save();
    return new UserResponseDto(createdUser);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.model.findOne({ email }).exec();
  }

  async findAll(): Promise<UserListResponseDto> {
    const users = await this.model.find().exec();

    return new UserListResponseDto(users);
  }

  async findById(id: string): Promise<UserResponseDto> {
    const user = await this.model.findOne({ id }).exec();

    return new UserResponseDto(user);
  }

  async updateUser(
    id: string,
    { name, password }: Partial<User>,
  ): Promise<UserResponseDto> {
    const userFromUpdate = await this.model.findOne({ id }).exec();

    const user = await this.model
      .findOneAndUpdate(
        { id },
        {
          name: name ? name : userFromUpdate.name,
          password: password
            ? await bcryptjs.hash(password, 10)
            : userFromUpdate.password,
        },
        { new: true },
      )
      .exec();
    return new UserResponseDto(user);
  }

  async deleteUser(id: string): Promise<object> {
    const user = await this.model.findByIdAndDelete({ id: id }).exec();

    console.log(user);

    return user;
  }
}
