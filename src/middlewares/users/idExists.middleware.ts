import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class IdExistsMiddleware implements NestMiddleware {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {}

  async use(req: any, res: Response, next: NextFunction) {
    const id: string = req.params.id;

    const idFromToken: string = req.user.sub;

    const user = await this.model.findOne({ id }).exec();

    if (!user) {
      throw new HttpException(`User not exists`, HttpStatus.NOT_FOUND);
    }

    if (id !== idFromToken) {
      throw new UnauthorizedException('User unauthorized');
    }

    return next();
  }
}
