import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IOrderRepository } from '../../domain/order.repository.port';
import { Order } from '../../domain/order.entity';

@Injectable()
export class UpdateOrderUseCase {
  constructor(@Inject('IOrderRepository') private readonly repo: IOrderRepository) {}

  async execute(id: string, patch: Partial<ReturnType<Order['toPlainObject']>>): Promise<Order> {
    const current = await this.repo.findById(id);
    if (!current) throw new NotFoundException('Order not found');

    const updated = new Order({
      id: current.id,
      userId: (patch.userId as string) ?? current.userId,
      products: (patch.products as any) ?? current.products,
      totalPrice: (patch.totalPrice as number) ?? current.totalPrice,
      status: (patch.status as string) ?? current.status,
      shippingAddress: (patch.shippingAddress as any) ?? current.shippingAddress,
      contactInfo: (patch.contactInfo as any) ?? current.contactInfo,
      paymentMethod: (patch.paymentMethod as string) ?? current.paymentMethod,
      paymentStatus: (patch.paymentStatus as string) ?? current.paymentStatus,
      orderDate: current.orderDate,
      shippedDate: (patch.shippedDate as Date) ?? current.shippedDate,
      deliveredDate: (patch.deliveredDate as Date) ?? current.deliveredDate,
    });

    const saved = await this.repo.update(updated);
    if (!saved) throw new NotFoundException('Order not found');
    return saved;
  }
}
