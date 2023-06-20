import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateInvoiceDto, UpdateInvoiceDto } from 'src/dtos/invoice.dto';
import { CreateItemDto } from 'src/dtos/item.dto';
import { Invoice, InvoiceDocument } from 'src/schemas/invoice.schema';
import { Item, ItemDocument } from 'src/schemas/item.schema';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<InvoiceDocument>,
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
  ) {}
  //   async create(data: CreateInvoiceDto): Promise<Invoice> {
  //     return await new this.invoiceModel(data).save();
  //   }

  async create(
    createInvoiceDto: CreateInvoiceDto,
    userId: string,
  ): Promise<Invoice> {
    const items = await this.createItems(createInvoiceDto.items);

    const invoice = new this.invoiceModel({
      ...createInvoiceDto,
      items,
      user: userId,
    });

    return invoice.save();
  }

  private async createItems(items: CreateItemDto[]): Promise<Item[]> {
    const createdItems = [];

    for (const item of items) {
      const createdItem = new this.itemModel(item);
      createdItems.push(await createdItem.save());
    }

    return createdItems;
  }

  async findAll(): Promise<Invoice[]> {
    return await this.invoiceModel.find().exec();
  }

  async findOne(id: string): Promise<Invoice> {
    return await this.invoiceModel.findOne({ id }).exec();
  }

  async update(id: string, data: UpdateInvoiceDto): Promise<Invoice> {
    return await this.invoiceModel
      .findOneAndUpdate({ id }, { ...data }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Invoice> {
    return this.invoiceModel.findByIdAndDelete({ id: id }).exec();
  }
}
