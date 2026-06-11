import { Order } from '../domain/order.entity';

export class OrderMapper {
  static toDomain(doc: any): Order {
    return Order.fromPersistence(doc);
  }

  static toPersistence(order: Order): Record<string, unknown> {
    return {
      userId: order.userId,
      products: order.products,
      totalPrice: order.totalPrice,
      status: order.status,
      shippingAddress: order.shippingAddress,
      contactInfo: order.contactInfo,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderDate: order.orderDate,
      shippedDate: order.shippedDate,
      deliveredDate: order.deliveredDate,
    };
  }
}
