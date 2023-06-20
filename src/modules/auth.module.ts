import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import * as Joi from 'joi';
import { AuthController } from 'src/controllers/auth/auth.controller';
import { EmailVerifyMiddleware } from 'src/middlewares/users/emailVerify.middleware';
import { PasswordVerifyMiddleware } from 'src/middlewares/users/passwordVerify.middleware';
import { User, UserSchema } from 'src/schemas/user.schema';
import { AuthService } from 'src/services/auth/auth.service';
import { EmailService } from 'src/services/emails/email.service';
import { UsersService } from 'src/services/users/users.service';
import { GoogleStrategy } from 'src/strategies/google.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string(),
      }),
      envFilePath: '../../.env',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, EmailService, UsersService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EmailVerifyMiddleware).forRoutes('auth');

    consumer.apply(PasswordVerifyMiddleware).forRoutes('auth/login');
  }
}
