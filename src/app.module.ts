import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { mailerConfig } from 'src/options/mailer.config';
// import './@types/express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { InvoicesController } from './controllers/invoices/invoices.controller';
import { PdfsController } from './controllers/pdfs/pdfs.controller';
import { UsersController } from './controllers/users/users.controller';
import { AuthModule } from './modules/auth.module';
import { EmailModule } from './modules/email.module';
import { InvoicesModule } from './modules/invoices.module';
import { PdfsModule } from './modules/pdfs.module';
import { UsersModule } from './modules/users.module';
import { databaseProviders } from './providers/data.providers';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { Item, ItemSchema } from './schemas/item.schema';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from './services/auth/auth.service';
import { EmailService } from './services/emails/email.service';
import { InvoicesService } from './services/invoices/invoices.service';
import { PdfsService } from './services/pdfs/pdfs.service';
import { UsersService } from './services/users/users.service';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
    AuthModule,
    UsersModule,
    PdfsModule,
    InvoicesModule,
    MailerModule.forRoot(mailerConfig),
    EmailModule,
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
    EmailService,
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
