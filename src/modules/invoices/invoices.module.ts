import { Module } from '@nestjs/common';
import { InvoicesController } from '../../controllers/invoices/invoices.controller';

@Module({
  controllers: [InvoicesController],
})
export class InvoicesModule {}
