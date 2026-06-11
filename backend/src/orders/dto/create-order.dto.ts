export class CreateOrderDto {
  userId: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  totalPrice: number;
  shippingAddress: {
    firstName: string;
    lastName?: string;
    companyName?: string;
    streetAddress: string;
    apartment?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  contactInfo: {
    phone: string;
    email: string;
  };
  paymentMethod: string;
}
