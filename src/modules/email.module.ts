import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/services/emails/email.service';

@Module({
  providers: [ConfigService, EmailService],
})
export class EmailModule {}
