export interface ContactProps {
  id?: string | null;
  name: string;
  email: string;
  subject: string;
  message: string;
  phone?: string;
  orderNumber?: string;
  status?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Contact {
  public readonly id: string | null;
  public name: string;
  public email: string;
  public subject: string;
  public message: string;
  public phone?: string;
  public orderNumber?: string;
  public status: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor(props: ContactProps) {
    if (!props.name?.trim()) throw new Error('نام الزامی است.');
    if (!props.email?.trim()) throw new Error('ایمیل الزامی است.');
    if (!props.subject?.trim()) throw new Error('موضوع الزامی است.');
    if (!props.message?.trim()) throw new Error('پیام الزامی است.');

    this.id = props.id ?? null;
    this.name = props.name;
    this.email = props.email;
    this.subject = props.subject;
    this.message = props.message;
    this.phone = props.phone;
    this.orderNumber = props.orderNumber;
    this.status = props.status ?? 'new';
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  updateStatus(status: string): void {
    this.status = status;
    this.updatedAt = new Date();
  }

  toPlainObject(): Record<string, unknown> {
    return {
      _id: this.id,
      id: this.id,
      name: this.name,
      email: this.email,
      subject: this.subject,
      message: this.message,
      phone: this.phone,
      orderNumber: this.orderNumber,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  static fromPersistence(data: any): Contact {
    return new Contact({
      id: data?._id?.toString?.() ?? data?.id ?? null,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      phone: data.phone,
      orderNumber: data.orderNumber,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }
}
