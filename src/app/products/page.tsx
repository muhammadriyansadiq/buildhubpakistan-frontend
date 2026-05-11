import { Suspense } from 'react';
import BuyerLayout from '../layouts/BuyerLayout';
import AllProducts from '../pages/buyer/AllProducts';

export default function ProductsPage() {
  return (
    <BuyerLayout>
      <Suspense fallback={<div className="min-h-screen bg-gray-50 animate-pulse" />}>
        <AllProducts />
      </Suspense>
    </BuyerLayout>
  );
}
