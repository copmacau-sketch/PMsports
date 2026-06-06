import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Providers } from '@/lib/providers';
import { Nav } from '@/components/nav';

export const metadata: Metadata = {
  title: 'Crown Explorer',
  description: 'Read-only forensic viewer for db_client snapshot.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-Hans">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <header className="sticky top-0 z-20 border-b border-border bg-bg/85 backdrop-blur">
            <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight">
                  Crown <span className="text-muted">Explorer</span>
                </span>
                <span className="badge text-muted">read-only</span>
              </div>
              <Nav />
            </div>
          </header>
          <main className="mx-auto w-full max-w-7xl px-4 py-6 flex-1">
            {children}
          </main>
          <footer className="border-t border-border text-xs text-muted">
            <div className="mx-auto max-w-7xl px-4 py-3">
              本视图仅用于结构 / 取证分析；所有写操作禁用，敏感字段默认脱敏。
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
