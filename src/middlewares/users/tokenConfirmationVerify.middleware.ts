import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UsersService } from 'src/services/users/users.service';

@Injectable()
export class TokenConfirmationVerifyMiddleware implements NestMiddleware {
  constructor(private readonly usersServices: UsersService) {}

  async use(req: any, __: Response, next: NextFunction) {
    const { email } = req.user;

    const user = await this.usersServices.findByEmail(email);

    if (user.confirmationToken) {
      throw new UnauthorizedException('Account unauthorized.');
    }

    return next();
  }
}
