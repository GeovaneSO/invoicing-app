import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.replace('Bearer ', '');
    console.log(token);

    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });

      (req as any).user = {
        sub: payload.sub,
        email: payload.email,
      };

      return next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
