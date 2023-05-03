import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Payload } from 'src/interfaces/auth.interface';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@InjectModel(User.name) private readonly model: Model<User>) {
    super({
      secretOrKey: process.env.SECRET_KEY,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
    });
  }

  async validate(payload: Payload): Promise<any> {
    const user = await this.model.findOne({ email: payload.email }).exec();
    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}
