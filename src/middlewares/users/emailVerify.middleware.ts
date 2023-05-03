import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from 'src/services/users/users.service';

@Injectable()
export class EmailVerifyMiddleware implements NestMiddleware {
  constructor(private readonly usersServices: UsersService) {}

  async use(req: Request, __: Response, next: NextFunction) {
    const { email } = req.body;

    const user = await this.usersServices.findByEmail(email);

    if (!user) {
      throw new HttpException(
        `Invalid email or password`,
        HttpStatus.BAD_REQUEST,
      );
    }

    return next();
  }
}
