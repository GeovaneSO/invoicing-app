import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { InvoicesController } from './controllers/invoices/invoices.controller';
import { PdfsController } from './controllers/pdfs/pdfs.controller';
import { UsersController } from './controllers/users/users.controller';
import { AuthModule } from './modules/auth.module';
import { InvoicesModule } from './modules/invoices.module';
import { PdfsModule } from './modules/pdfs.module';
import { UsersModule } from './modules/users.module';
import { databaseProviders } from './providers/data.providers';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from './services/auth/auth.service';
import { InvoicesService } from './services/invoices/invoices.service';
import { PdfsService } from './services/pdfs/pdfs.service';
import { UsersService } from './services/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    UsersModule,
    PdfsModule,
    InvoicesModule,
  ],
  controllers: [
    AppController,
    AuthController,
    InvoicesController,
    UsersController,
    PdfsController,
  ],
  providers: [
    AppService,
    UsersService,
    InvoicesService,
    PdfsService,
    AuthService,
    JwtService,
    ConfigService,
    GoogleStrategy,
    ...databaseProviders,
  ],
  exports: [ConfigModule],
})
export class AppModule {}
