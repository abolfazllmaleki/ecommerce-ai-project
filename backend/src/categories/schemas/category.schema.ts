// src/categories/schemas/category.schema.ts
import { Schema, Document } from 'mongoose';

export const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // نام دسته‌بندی باید منحصر به فرد باشد
    trim: true, // حذف فاصله‌های اضافی از ابتدا و انتها
  },
  description: {
    type: String,
    default: '', // توضیحات اختیاری
  },
  image: {
    type: String,
    default: '', // آدرس تصویر دسته‌بندی
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    ref: 'Category', // برای دسته‌بندی‌های تو در تو
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true, // فعال یا غیرفعال بودن دسته‌بندی
  },
  createdAt: {
    type: Date,
    default: Date.now, // تاریخ ایجاد
  },
  updatedAt: {
    type: Date,
    default: Date.now, // تاریخ به‌روزرسانی
  },
});

// اینترفیس برای TypeScript
export interface Category extends Document {
  name: string;
  description?: string;
  image?: string;
  parentCategory?: Category | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
