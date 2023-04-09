import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './controllers/auth/auth.controller';
import { InvoicesController } from './controllers/invoices/invoices.controller';
import { PdfsController } from './controllers/pdfs/pdfs.controller';
import { UsersController } from './controllers/users/users.controller';
import { AuthModule } from './modules/auth/auth.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { PdfsModule } from './modules/pdfs/pdfs.module';
import { UsersModule } from './modules/users/users.module';
import { AuthService } from './services/auth/auth.service';
import { InvoicesService } from './services/invoices/invoices.service';
import { PdfsService } from './services/pdfs/pdfs.service';
import { UsersService } from './services/users/users.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/invoicing-app'),
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
  ],
})
export class AppModule {}
