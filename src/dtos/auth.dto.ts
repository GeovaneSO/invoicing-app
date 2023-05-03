import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthRequestDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  readonly password: string;
}
