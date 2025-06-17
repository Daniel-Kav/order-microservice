import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order } from './schemas/order.schema';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { Logger } from '@nestjs/common';

@Resolver(() => Order)
export class OrderResolver {
  private readonly logger = new Logger(OrderResolver.name);

  constructor(private readonly orderService: OrderService) {}

  @Mutation(() => Order)
  async createOrder(@Args('createOrderInput') createOrderInput: CreateOrderInput): Promise<Order> {
    this.logger.log('Creating new order via GraphQL');
    return this.orderService.createOrder(createOrderInput);
  }

  @Query(() => [Order], { name: 'orders' })
  async findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Query(() => Order, { name: 'order' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Query(() => [Order], { name: 'ordersByUser' })
  async findByUserId(@Args('userId') userId: string): Promise<Order[]> {
    return this.orderService.findByUserId(userId);
  }

  @Mutation(() => Order)
  async updateOrder(@Args('updateOrderInput') updateOrderInput: UpdateOrderInput): Promise<Order> {
    return this.orderService.updateOrder(updateOrderInput);
  }

  @Mutation(() => Order)
  async confirmPayment(@Args('orderId', { type: () => ID }) orderId: string): Promise<Order> {
    this.logger.log(`Confirming payment for order: ${orderId}`);
    return this.orderService.confirmPayment(orderId);
  }

  @Mutation(() => Order)
  async cancelOrder(@Args('orderId', { type: () => ID }) orderId: string): Promise<Order> {
    this.logger.log(`Cancelling order: ${orderId}`);
    return this.orderService.cancelOrder(orderId);
  }

  @Mutation(() => Boolean)
  async deleteOrder(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.orderService.deleteOrder(id);
  }
}
