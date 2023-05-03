import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Invoice, InvoiceDocument } from 'src/schemas/invoice.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
  ) {}
  async create(data: CreateInvoiceDto): Promise<Invoice> {
    const createdInvoice = new this.invoiceModel(data);
  }
}
