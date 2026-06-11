import { Contact } from '../domain/contact.entity';
import { ContactDocument } from '../schemas/contact.schema';

export class ContactMapper {
  static toDomain(doc: ContactDocument | any): Contact {
    return Contact.fromPersistence(doc);
  }

  static toPersistence(contact: Contact): Record<string, unknown> {
    return {
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      phone: contact.phone,
      orderNumber: contact.orderNumber,
      status: contact.status,
      updatedAt: contact.updatedAt,
    };
  }

  static toPersistenceOnCreate(contact: Contact): Record<string, unknown> {
    return {
      ...this.toPersistence(contact),
      createdAt: contact.createdAt,
    };
  }
}
