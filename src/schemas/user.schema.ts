import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidV4 } from 'uuid';

@Schema()
export class User {
  @Prop({ default: () => uuidV4(), unique: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  // toJSON() {
  //   const { _id, __v, password, ...userObject } = this.toObject();
  //   return userObject;
  // }
}

export type UserDocument = User & Document;

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.set('toJSON', {
//   transform: (doc, ret) => {
//     ret.id = ret._id;
//     delete ret._id;
//     delete ret.__v;
//     delete ret.password;
//   },
// });
