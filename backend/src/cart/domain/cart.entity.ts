export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  addedAt: Date;
}

export interface CartProps {
  id?: string | null;
  userId: string;
  items: CartItem[];
  total: number;
}

export class Cart {
  public readonly id: string | null;
  public userId: string;
  public items: CartItem[];
  public total: number;

  constructor(props: CartProps) {
    this.id = props.id ?? null;
    this.userId = props.userId;
    this.items = props.items ?? [];
    this.total = props.total ?? 0;
  }

  recalculateTotal(): void {
    this.total = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  addItem(productId: string, price: number): void {
    if (this.items.length >= 20) {
      throw new Error('Cart items limit exceeded (max 20 items)');
    }

    const existing = this.items.find(i => i.productId === productId);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.items.push({
        productId,
        quantity: 1,
        price,
        addedAt: new Date(),
      });
    }
    this.recalculateTotal();
  }

  updateItemQuantity(productId: string, quantity: number): void {
    const item = this.items.find(i => i.productId === productId);
    if (!item) throw new Error('CART_ITEM_NOT_FOUND');
    item.quantity = quantity;
    this.recalculateTotal();
  }

  removeItem(productId: string): void {
    this.items = this.items.filter(i => i.productId !== productId);
    this.recalculateTotal();
  }

  static fromPersistence(data: any): Cart {
    return new Cart({
      id: data?._id?.toString?.() ?? data?.id ?? null,
      userId: data.user?.toString?.() ?? data.userId,
      items: (data.items ?? []).map((item: any) => ({
        productId: item.product?.toString?.() ?? item.product,
        quantity: item.quantity,
        price: item.price,
        addedAt: item.addedAt,
      })),
      total: data.total ?? 0,
    });
  }
}
