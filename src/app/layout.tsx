import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/header';
import { ThemeProvider } from '@/components/theme-provider';
import { Footer } from '@/components/footer';
import { ContactFormModal } from '@/components/contact-form-modal';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <ContactFormModal />
          <Footer />
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
