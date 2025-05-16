import './globals.css';
import { lusitana } from '@/app/ui/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lusitana.className} antialiased flex flex-col min-h-screen`}>
        {children}
        <footer className="flex items-center justify-center p-6">
        Created by Diego Puentes
      </footer>
      </body>      
    </html>
  );
}