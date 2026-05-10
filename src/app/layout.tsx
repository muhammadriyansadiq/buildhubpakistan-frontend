import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/index.css'; // Adjust if needed
import { QueryProvider } from '../providers/query-provider';
import { Toaster } from './components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Build Hub Frontend',
  description: 'Next.js App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <QueryProvider>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </QueryProvider>
      </body>
    </html>
  );
}
