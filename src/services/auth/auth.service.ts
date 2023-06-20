import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthRequestDto } from 'src/dtos/auth.dto';
import { CreateUserDto } from 'src/dtos/user.dto';
import { Payload } from 'src/interfaces/auth.interface';
import { generateFromEmail } from 'unique-username-generator';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersServices: UsersService,
  ) {}

  generateJwt(payload: Payload) {
    const token = {
      access_token: this.jwtService.sign(
        { email: payload.email },
        {
          secret: process.env.SECRET_KEY,
          expiresIn: '24h',
          subject: payload.sub,
        },
      ),
    };

    if (!token) {
      throw new UnauthorizedException();
    }
    return token;
  }

  async session(data: AuthRequestDto): Promise<object> {
    const user = await this.usersServices.findByEmail(data.email);

    return this.generateJwt({ email: user.email, sub: user.id });
  }

  async googleSession(user: CreateUserDto): Promise<{
    access_token: string;
  }> {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.usersServices.findByEmail(user.email);

    if (!userExists) {
      const newUser = await this.usersServices.createUser({
        name: user.name,
        email: user.email,
        password: generateFromEmail(user.email, 5),
      });

      return this.generateJwt({ email: newUser.email, sub: newUser.id });
    }
    return this.generateJwt({ email: userExists.email, sub: userExists.id });
  }
}
