import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { InvoiceItem } from '../interfaces/invoice.interface';
import { User } from './user.schema';
import { Item, ItemSchema } from './item.schema';

export type InvoiceDocument = Invoice & Document;

@Schema()
export class Invoice {
  @Prop({ default: () => uuidV4(), unique: true })
  id: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'pending', enum: ['pending', 'paid', 'cancelled'] })
  status: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: [ItemSchema], required: true })
  items: Item[];

  @Prop({ default: Date.now() })
  createdAt: Date;

  @Prop({ required: true })
  due_date: Date;

  get total(): number {
    return this.items.reduce(
      (total: number, item: InvoiceItem) => total + item.amount * item.quantity,
      0,
    );
  }
}

export const InvoiceSchema = SchemaFactory.createForClass(User);
