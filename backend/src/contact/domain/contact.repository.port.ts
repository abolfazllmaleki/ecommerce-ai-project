import { Contact } from './contact.entity';

export interface IContactRepository {
  create(contact: Contact): Promise<Contact>;
  findAll(): Promise<Contact[]>;
  findById(id: string): Promise<Contact | null>;
  updateStatus(id: string, status: string): Promise<Contact | null>;
  delete(id: string): Promise<boolean>;
}
