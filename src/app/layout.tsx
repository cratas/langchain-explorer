import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { HomeLayout } from '@/layouts';
import { ThemeProvider } from '@/components/tailwind-components';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LangChain explorer',
  description: 'Discover possibilities using LangChain in web applications.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <HomeLayout>{children}</HomeLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
