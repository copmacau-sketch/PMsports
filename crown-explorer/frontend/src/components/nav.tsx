'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { classNames } from '@/lib/format';

const items = [
  { href: '/',            label: '总览' },
  { href: '/agents',      label: '代理' },
  { href: '/members',     label: '会员' },
  { href: '/bets',        label: '注单' },
  { href: '/cashflow',    label: '资金' },
  { href: '/messages',    label: '公告' },
];

export function Nav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1">
      {items.map((it) => {
        const active =
          it.href === '/'
            ? pathname === '/'
            : pathname?.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            className={classNames('nav-link', active && 'nav-link-active')}
          >
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}
