import BuyerLayout from '../../layouts/BuyerLayout';
import BuyerProfile from '../../pages/buyer/BuyerProfile';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <BuyerLayout>
        <BuyerProfile />
      </BuyerLayout>
    </ProtectedRoute>
  );
}
