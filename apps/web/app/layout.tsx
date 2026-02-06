import './globals.css';
import type { ReactNode } from 'react';
import Providers from './providers';
import Image from 'next/image';
import { Button } from '@heroui/react';
import { useAuth } from '../components/AuthProvider';
import HeaderActions from './HeaderActions';

export const metadata = {
  title: 'Kodi Dashboard',
  description: 'Documentação Ativa — Kodi',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="min-h-screen text-gray-900">
        <Providers>
          <header className="border-b brand-border p-4 flex gap-4 items-center justify-between bg-white/70 backdrop-blur">
            <nav className="flex gap-4">
              <a href="/" className="font-semibold flex items-center gap-2">
                <Image src="/logo.png" alt="Kodi" width={28} height={28} />
                <span className="brand-text">Kodi</span>
              </a>
              <a href="/patterns">Padrões</a>
              <a href="/analysis">Análise</a>
              <a href="/history">Histórico</a>
              <a href="/settings">Configurações</a>
            </nav>
            <HeaderActions />
          </header>
          <main className="p-6">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
