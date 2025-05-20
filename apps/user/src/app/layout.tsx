import '@repo/ui/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { AppbarClient } from '../components/appbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WallyPay',
  description: 'Wallet App used for peer-peer money transfer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AppbarClient />
          <div className='w-full mx-auto'>{children}</div>
        </Providers>
      </body>
    </html>
  );
}
