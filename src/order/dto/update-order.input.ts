import { InputType, Field, ID } from '@nestjs/graphql';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { OrderStatus } from '../schemas/order.schema';

@InputType()
export class UpdateOrderInput {
  @Field(() => ID)
  @IsString()
  id: string;

  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
