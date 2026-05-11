import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/index.css'; // Adjust if needed
import { QueryProvider } from '../providers/query-provider';
import { Toaster } from './components/ui/sonner';
import Favicon from '../imports/buildhub.png';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Build Hub Pakistan',
  description: 'Next.js App',
  icons: {
    icon: Favicon.src,
  },
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
