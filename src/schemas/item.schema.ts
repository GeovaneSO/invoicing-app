import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';
import { Invoice } from './invoice.schema';

export type ItemDocument = Item & Document;

@Schema()
export class Item {
  @Prop({ default: () => uuidV4(), unique: true })
  id: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  quantity: number;

  @Prop({ type: mongooseSchema.Types.ObjectId, ref: 'Invoice' })
  invoice: Invoice;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
