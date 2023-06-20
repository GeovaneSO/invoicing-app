import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  NotFoundException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as cache from 'memory-cache';
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

    const valorCache: string = cache.get('EMAIL_USER');
    const valorString = valorCache !== undefined ? valorCache : '';

    if (!valorString) {
      throw new NotFoundException('Invalid token');
    }

    const userFromEmailCache = await this.usersServices.findByEmail(
      valorString,
    );

    if (!userFromEmailCache) {
      throw new HttpException(
        `Invalid email or password`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return next();
  }
}
