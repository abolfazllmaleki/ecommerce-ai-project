import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';
import LoadingSpinner from '@/app/components/LoadingSpinner/LoadingSpinner';

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}}/api/products/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductDetailClient initialProduct={product} />
    </Suspense>
  );
}