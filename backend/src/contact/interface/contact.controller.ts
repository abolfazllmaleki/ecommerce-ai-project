import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateContactDto, ContactResponseDto } from '../dto/contact.dto';
import { CreateContactUseCase } from '../application/use-cases/create-contact.usecase';
import { FindAllContactsUseCase } from '../application/use-cases/find-all-contacts.usecase';
import { FindContactByIdUseCase } from '../application/use-cases/find-contact-by-id.usecase';
import { UpdateContactStatusUseCase } from '../application/use-cases/update-contact-status.usecase';
import { DeleteContactUseCase } from '../application/use-cases/delete-contact.usecase';
import { Contact } from '../domain/contact.entity';

@Controller('contact')
export class ContactController {
  constructor(
    private readonly createContact: CreateContactUseCase,
    private readonly findAllContacts: FindAllContactsUseCase,
    private readonly findContactById: FindContactByIdUseCase,
    private readonly updateContactStatus: UpdateContactStatusUseCase,
    private readonly deleteContact: DeleteContactUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateContactDto) {
    try {
      const contact = await this.createContact.execute(dto);
      return {
        message: 'Contact form submitted successfully',
        data: this.mapToResponseDto(contact),
      };
    } catch {
      throw new HttpException(
        'Failed to create contact',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const contacts = await this.findAllContacts.execute();
      return {
        data: contacts.map(c => this.mapToResponseDto(c)),
      };
    } catch {
      throw new HttpException(
        'Failed to fetch contacts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const contact = await this.findContactById.execute(id);
      return { data: this.mapToResponseDto(contact) };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to fetch contact',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    try {
      const contact = await this.updateContactStatus.execute(id, status);
      return {
        message: 'Status updated successfully',
        data: this.mapToResponseDto(contact),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to update status',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.deleteContact.execute(id);
      return { message: 'Contact deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Failed to delete contact',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private mapToResponseDto(contact: Contact): ContactResponseDto {
    const plain = contact.toPlainObject();
    return {
      _id: plain._id as any,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      phone: contact.phone,
      orderNumber: contact.orderNumber,
      createdAt: contact.createdAt,
      updatedAt: contact.updatedAt,
      status: contact.status,
    };
  }
}
