import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: {
    default: 'Luxe Salon — Premium Hair & Beauty',
    template: '%s | Luxe Salon',
  },
  description:
    'Book your next hair, beauty, or wellness appointment at Luxe Salon. Expert stylists, premium products, and a relaxing experience.',
  keywords: ['salon', 'hair', 'beauty', 'booking', 'appointment', 'stylist'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
