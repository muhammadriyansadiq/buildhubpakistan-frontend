import BuyerLayout from '../../layouts/BuyerLayout';
import BuyerDashboard from '../../pages/buyer/BuyerDashboard';
import ProtectedRoute from '@/app/components/auth/ProtectedRoute';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <BuyerLayout>
        <BuyerDashboard />
      </BuyerLayout>
    </ProtectedRoute>
  );
}
