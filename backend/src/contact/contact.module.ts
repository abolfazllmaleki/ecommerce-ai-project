import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './schemas/contact.schema';
import { ContactController } from './interface/contact.controller';
import { ContactRepository } from './infrastructure/contact.repository';
import { CreateContactUseCase } from './application/use-cases/create-contact.usecase';
import { FindAllContactsUseCase } from './application/use-cases/find-all-contacts.usecase';
import { FindContactByIdUseCase } from './application/use-cases/find-contact-by-id.usecase';
import { UpdateContactStatusUseCase } from './application/use-cases/update-contact-status.usecase';
import { DeleteContactUseCase } from './application/use-cases/delete-contact.usecase';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
  ],
  controllers: [ContactController],
  providers: [
    { provide: 'IContactRepository', useClass: ContactRepository },
    CreateContactUseCase,
    FindAllContactsUseCase,
    FindContactByIdUseCase,
    UpdateContactStatusUseCase,
    DeleteContactUseCase,
  ],
  exports: ['IContactRepository'],
})
export class ContactModule {}
