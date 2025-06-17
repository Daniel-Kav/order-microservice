import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Field, ObjectType, ID, Float, registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });
registerEnumType(PaymentStatus, { name: 'PaymentStatus' });

@ObjectType()
export class OrderItem {
  @Field()
  @Prop({ required: true })
  productId: string;

  @Field()
  @Prop({ required: true })
  name: string;

  @Field(() => Float)
  @Prop({ required: true })
  price: number;

  @Field()
  @Prop({ required: true })
  quantity: number;
}

@ObjectType()
export class ShippingAddress {
  @Field()
  @Prop({ required: true })
  street: string;

  @Field()
  @Prop({ required: true })
  city: string;

  @Field()
  @Prop({ required: true })
  state: string;

  @Field()
  @Prop({ required: true })
  zipCode: string;

  @Field()
  @Prop({ required: true })
  country: string;
}

@Schema({ timestamps: true })
@ObjectType()
export class Order {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true })
  userId: string;

  @Field(() => [OrderItem])
  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Field(() => Float)
  @Prop({ required: true })
  totalAmount: number;

  @Field(() => OrderStatus)
  @Prop({ enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Field(() => PaymentStatus)
  @Prop({ enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Field({ nullable: true })
  @Prop()
  stripePaymentIntentId?: string;

  @Field(() => ShippingAddress)
  @Prop({ type: ShippingAddress, required: true })
  shippingAddress: ShippingAddress;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;

  @Field()
  @Prop({ default: Date.now })
  updatedAt: Date;
}

export type OrderDocument = Order & Document & {
  save: () => Promise<OrderDocument>;
  // Add other Mongoose document methods you might use
};
export const OrderSchema = SchemaFactory.createForClass(Order);
