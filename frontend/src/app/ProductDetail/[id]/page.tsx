import { Suspense } from 'react';
import ProductDetailClient from './ProductDetailClient';
import LoadingSpinner from '@/app/components/LoadingSpinner/LoadingSpinner';
import RelatedProducts from '@/app/components/RelatedProducts/RelatedProducts';
import CommentSection from '@/app/components/CommentSection/CommentSection';

async function getProduct(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

async function getRelatedProducts(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}/related`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch related products');
  return res.json();
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const product = await getProduct(id);
  const relatedProducts = await getRelatedProducts(id);

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProductDetailClient initialProduct={product} />
      <RelatedProducts products={relatedProducts} />
      <div className="container mx-auto px-4 py-8">
        <CommentSection productId={id} />
      </div>
    </Suspense>
  );
}
