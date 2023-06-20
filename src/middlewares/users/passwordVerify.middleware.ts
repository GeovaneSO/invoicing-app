import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/services/users/users.service';

@Injectable()
export class PasswordVerifyMiddleware implements NestMiddleware {
  constructor(private readonly usersServices: UsersService) {}

  async use(req: Request, __: Response, next: NextFunction) {
    const { password, email } = req.body;

    const user = await this.usersServices.findByEmail(email);

    const passwordHashed = await bcryptjs.compare(password, user.password);

    if (!passwordHashed) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return next();
  }
}
