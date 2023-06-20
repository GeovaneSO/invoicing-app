import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Invoice, InvoiceSchema } from 'src/schemas/invoice.schema';
import { InvoicesService } from 'src/services/invoices/invoices.service';
import { InvoicesController } from '../controllers/invoices/invoices.controller';
import { Item, ItemSchema } from 'src/schemas/item.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Invoice.name, schema: InvoiceSchema }]),
    MongooseModule.forFeature([{ name: Item.name, schema: ItemSchema }]),
  ],
  exports: [InvoicesService],
  providers: [InvoicesService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
