import { IsEmail, IsNotEmpty, IsOptional, isString } from 'class-validator';
import { Types } from 'mongoose';
import { User } from 'src/schemas/user.schema';

export class CreateUserDto {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export class UpdateUserDto {
  readonly name?: string;
  readonly password?: string;

  @IsOptional()
  readonly id?: string;
}

export class UserResponseDto extends User {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  __v: number;

  @IsNotEmpty()
  _id: Types.ObjectId;

  constructor(user?: User | null) {
    super();
    if (user) {
      this.id = user.id;
      this.name = user.name;
      this.email = user.email;
    }
  }

  toJSON() {
    const { password, __v, ...userObject } = this;
    return userObject;
  }
}

export class UserListResponseDto {
  users: UserResponseDto[];

  constructor(users: User[]) {
    this.users = users.map((user) => new UserResponseDto(user));
  }
}
