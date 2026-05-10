import BuyerNavbar from '../components/layout/BuyerNavbar';
import DemoNav from '../components/layout/DemoNav';
import Footer from '../components/layout/Footer';

export default function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FAFC' }}>
      <div className="sticky top-0 z-40">
        <DemoNav />
        <BuyerNavbar />
      </div>
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
