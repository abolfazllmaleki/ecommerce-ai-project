export interface OrderLineItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface ShippingAddress {
  firstName: string;
  lastName?: string;
  companyName?: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
}

export interface OrderProps {
  id?: string | null;
  userId: string;
  products: OrderLineItem[];
  totalPrice: number;
  status?: string;
  shippingAddress: ShippingAddress;
  contactInfo: ContactInfo;
  paymentMethod: string;
  paymentStatus?: string;
  orderDate?: Date;
  shippedDate?: Date;
  deliveredDate?: Date;
}

export class Order {
  public readonly id: string | null;
  public userId: string;
  public products: OrderLineItem[];
  public totalPrice: number;
  public status: string;
  public shippingAddress: ShippingAddress;
  public contactInfo: ContactInfo;
  public paymentMethod: string;
  public paymentStatus: string;
  public readonly orderDate: Date;
  public shippedDate?: Date;
  public deliveredDate?: Date;

  constructor(props: OrderProps) {
    if (!props.userId?.trim()) throw new Error('شناسه کاربر الزامی است.');
    if (!props.products?.length) throw new Error('سفارش باید حداقل یک محصول داشته باشد.');
    if (props.totalPrice < 0) throw new Error('مبلغ کل نمی‌تواند منفی باشد.');

    this.id = props.id ?? null;
    this.userId = props.userId;
    this.products = props.products;
    this.totalPrice = props.totalPrice;
    this.status = props.status ?? 'pending';
    this.shippingAddress = props.shippingAddress;
    this.contactInfo = props.contactInfo;
    this.paymentMethod = props.paymentMethod;
    this.paymentStatus = props.paymentStatus ?? 'pending';
    this.orderDate = props.orderDate ?? new Date();
    this.shippedDate = props.shippedDate;
    this.deliveredDate = props.deliveredDate;
  }

  updateStatus(status: string): void {
    this.status = status;
    if (status === 'shipped') this.shippedDate = new Date();
    if (status === 'delivered') this.deliveredDate = new Date();
  }

  updatePaymentStatus(paymentStatus: string): void {
    this.paymentStatus = paymentStatus;
  }

  toPlainObject(): Record<string, unknown> {
    return {
      _id: this.id,
      id: this.id,
      userId: this.userId,
      products: this.products,
      totalPrice: this.totalPrice,
      status: this.status,
      shippingAddress: this.shippingAddress,
      contactInfo: this.contactInfo,
      paymentMethod: this.paymentMethod,
      paymentStatus: this.paymentStatus,
      orderDate: this.orderDate,
      shippedDate: this.shippedDate,
      deliveredDate: this.deliveredDate,
    };
  }

  static fromPersistence(data: any): Order {
    return new Order({
      id: data?._id?.toString?.() ?? data?.id ?? null,
      userId: data.userId,
      products: data.products,
      totalPrice: data.totalPrice,
      status: data.status,
      shippingAddress: data.shippingAddress,
      contactInfo: data.contactInfo,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentStatus,
      orderDate: data.orderDate,
      shippedDate: data.shippedDate,
      deliveredDate: data.deliveredDate,
    });
  }
}
