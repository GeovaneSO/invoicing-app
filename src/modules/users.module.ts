import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { UsersController } from 'src/controllers/users/users.controller';
import { EmailExistsMiddleware } from 'src/middlewares/users/emailExists.middleware';
import { IdExistsMiddleware } from 'src/middlewares/users/idExists.middleware';
import { JwtMiddleware } from 'src/middlewares/users/jwt.middleware';
import { TokenConfirmationVerifyMiddleware } from 'src/middlewares/users/tokenConfirmationVerify.middleware';
import { usersProviders } from 'src/providers/users.providers';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UsersService } from 'src/services/users/users.service';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { DatabaseModule } from './data.module';
import { EmailService } from 'src/services/emails/email.service';

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
      envFilePath: '../../.env',
    }),
    JwtModule.register({}),
  ],
  controllers: [UsersController],
  exports: [UsersService],
  providers: [...usersProviders, UsersService, EmailService, JwtStrategy],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(JwtMiddleware)
      .exclude({ path: 'users', method: RequestMethod.POST }, 'users/()')
      .exclude(
        { path: 'users/send-email-recover', method: RequestMethod.POST },
        'users/()',
      )
      .forRoutes('users');

    consumer
      .apply(TokenConfirmationVerifyMiddleware)
      .exclude({ path: 'users', method: RequestMethod.POST }, 'users/()')
      .exclude(
        { path: 'users/send-email-recover', method: RequestMethod.POST },
        'users/()',
      )
      .forRoutes('users');

    consumer
      .apply(EmailExistsMiddleware)
      .forRoutes({ path: 'users', method: RequestMethod.POST });

    consumer
      .apply(IdExistsMiddleware)
      .exclude({ path: 'users', method: RequestMethod.POST }, 'users/()')
      .exclude(
        { path: 'users/send-email-recover', method: RequestMethod.POST },
        'users/()',
      )
      .forRoutes('users/:id');
  }
}
