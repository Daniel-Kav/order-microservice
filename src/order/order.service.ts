import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, OrderStatus, PaymentStatus } from './schemas/order.schema';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { StripeService } from './stripe.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private stripeService: StripeService,
  ) {}

  async createOrder(createOrderInput: CreateOrderInput): Promise<Order> {
    try {
      // Calculate total amount
      const totalAmount = createOrderInput.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );

      // Create order document
      const order = new this.orderModel({
        ...createOrderInput,
        totalAmount,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      });

      const savedOrder = await order.save();

      // Create Stripe payment intent
      const paymentIntent = await this.stripeService.createPaymentIntent(savedOrder);

      // Update order with payment intent ID
      savedOrder.stripePaymentIntentId = paymentIntent.id;
      await savedOrder.save();

      this.logger.log(`Created order: ${savedOrder._id} with payment intent: ${paymentIntent.id}`);
      return savedOrder;
    } catch (error) {
      this.logger.error('Failed to create order:', error);
      throw new BadRequestException('Failed to create order');
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).exec();
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    return this.orderModel.find({ userId }).exec();
  }

  async updateOrder(updateOrderInput: UpdateOrderInput): Promise<Order> {
    const { id, ...updateData } = updateOrderInput;
    
    const order = await this.orderModel.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true },
    ).exec();

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    this.logger.log(`Updated order: ${id}`);
    return order;
  }

  async confirmPayment(orderId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not in a pending state');
    }

    if (!order.stripePaymentIntentId) {
      throw new BadRequestException('No payment intent found for this order');
    }

    try {
      const paymentIntent = await this.stripeService.retrievePaymentIntent(
        order.stripePaymentIntentId,
      );

      if (paymentIntent.status === 'succeeded') {
        // Update the order with the new statuses
        const updatedOrder = await this.orderModel.findByIdAndUpdate(
          orderId,
          {
            $set: {
              paymentStatus: PaymentStatus.SUCCEEDED,
              status: OrderStatus.PROCESSING,
              updatedAt: new Date()
            }
          },
          { new: true }
        );

        if (!updatedOrder) {
          throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
        
        this.logger.log(`Payment confirmed for order: ${orderId}`);
        return updatedOrder;
      }

      return order;
    } catch (error) {
      this.logger.error(`Failed to confirm payment for order ${orderId}:`, error);
      throw new BadRequestException('Failed to confirm payment');
    }
  }

  async cancelOrder(orderId: string): Promise<Order> {
    const order = await this.orderModel.findById(orderId);
    
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }

    if (order.status === OrderStatus.CANCELLED) {
      return order.toObject();
    }

    // If payment was made, process refund
    if (order.paymentStatus === PaymentStatus.SUCCEEDED && order.stripePaymentIntentId) {
      try {
        await this.stripeService.refundPayment(order.stripePaymentIntentId);
        order.paymentStatus = PaymentStatus.REFUNDED;
      } catch (error) {
        this.logger.error(`Failed to refund payment for order ${orderId}:`, error);
      }
    }

    order.status = OrderStatus.CANCELLED;
    const updatedOrder = await order.save();

    if (!updatedOrder) {
      throw new Error('Failed to save the cancelled order');
    }

    this.logger.log(`Cancelled order: ${orderId}`);
    return updatedOrder.toObject();
  }

  async deleteOrder(id: string): Promise<boolean> {
    const result = await this.orderModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
