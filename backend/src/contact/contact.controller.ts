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
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/contact.dto';
import { ContactResponseDto } from './dto/contact.dto';
import { NotFoundException } from '@nestjs/common';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    try {
      const contact = await this.contactService.create(createContactDto);
      return {
        message: 'Contact form submitted successfully',
        data: this.mapToResponseDto(contact),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to create contact',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      const contacts = await this.contactService.findAll();
      return {
        data: contacts.map(this.mapToResponseDto),
      };
    } catch (error) {
      throw new HttpException(
        'Failed to fetch contacts',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const contact = await this.contactService.findById(id);
      return {
        data: this.mapToResponseDto(contact),
      };
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
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    try {
      const contact = await this.contactService.updateStatus(id, status);
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
      await this.contactService.delete(id);
      return {
        message: 'Contact deleted successfully',
      };
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

  private mapToResponseDto(contact: any): ContactResponseDto {
    return {
      _id: contact._id,
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