import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';
import LoadingSpinner from '@/app/components/LoadingSpinner/LoadingSpinner';

async function getProduct(id: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const apiUrl = `${baseUrl}/products/${id}`;
  console.log('ss===='+baseUrl)
  console.log('Fetching from:', apiUrl); // برای دیباگ

  const res = await fetch(apiUrl, {
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    console.error('API Error:', errorData);
    throw new Error(errorData.message || `Failed to fetch product (Status: ${res.status})`);
  }

  return res.json();
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  try {
    const product = await getProduct(params.id);
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <ProductDetailClient initialProduct={product} />
      </Suspense>
    );
  } catch (error) {
    console.error('Page Error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border-l-4 border-red-500 p-8 max-w-md">
          <h2 className="text-xl font-bold text-red-700 mb-2">خطا در دریافت محصول</h2>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }
}