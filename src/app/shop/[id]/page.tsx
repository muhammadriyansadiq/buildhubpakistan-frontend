'use client';

import { useParams } from 'next/navigation';
import ShopProfile from '@/app/pages/buyer/ShopProfile';
import BuyerNavbar from '@/app/components/layout/BuyerNavbar';

export default function ShopProfilePage() {
  const params = useParams();
  const id = params?.id ? Number(params.id) : 0;

  return (
    <>
      <BuyerNavbar />
      <ShopProfile sellerId={id} />
    </>
  );
}
