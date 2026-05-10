import BuyerLayout from '../layouts/BuyerLayout';
import Cart from '../pages/buyer/Cart';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';

export default function CartPage() {
  return (
    <ProtectedRoute>
      <BuyerLayout>
        <Cart />
      </BuyerLayout>
    </ProtectedRoute>
  );
}
