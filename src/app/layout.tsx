import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from '@/components/tailwind-components';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'jotai';

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
        <Provider>
          <ThemeProvider>
            <ToastContainer
              position="top-center"
              autoClose={5000}
              hideProgressBar
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />

            <>{children}</>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
