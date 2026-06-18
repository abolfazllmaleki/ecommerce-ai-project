import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Post('images')
  @UseInterceptors(
    FilesInterceptor('images', 3, {
      storage: memoryStorage(),
      limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
      },
      fileFilter: (req, file, callback) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const isValid = allowedTypes.test(file.mimetype);

        if (!isValid) {
          callback(
            new BadRequestException('Only jpg, jpeg, png, webp allowed'),
            false,
          );
        } else {
          callback(null, true);
        }
      },
    }),
  )
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No images uploaded');
    }

    const urls: string[] = [];

    for (const file of files) {
      const url = await this.cloudinaryService.uploadImage(file.buffer);
      urls.push(url);
    }

    return {
      message: 'Images uploaded successfully',
      images: urls,
    };
  }
}
