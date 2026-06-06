'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table';
import { Section } from '@/components/section';
import { api, qs } from '@/lib/api';
import { fmtMoney, fmtUnixTs } from '@/lib/format';

type Member = {
  id: number;
  nid: string;
  name: string;
  loginname: string | null;
  status: number;
  isout: number;
  credit: number | null;
  balance_credit: number | null;
  currency: string | null;
  pay_type: number | null;
  ag: string | null;
  su: string | null;
  co: string | null;
  d0: string | null;
  loginip: string | null;
  email: string | null;
  adddate: number | null;
  lastdate: number | null;
};

type Page = { total: number; items: Member[] };

export default function MembersPage() {
  const [q, setQ] = useState('');
  const [reveal, setReveal] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['members', q, reveal],
    queryFn: () =>
      api<Page>(`/api/members${qs({ q, reveal, limit: 200 })}`),
  });

  return (
    <Section
      title="会员"
      description={`member 表（${data?.total ?? '—'} 条）— ag/su/co/d0 是其挂载的四级代理链。`}
      right={
        <div className="flex items-center gap-2">
          <input
            className="input w-56"
            placeholder="搜索 loginname / name"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <label className="badge cursor-pointer select-none">
            <input
              type="checkbox"
              checked={reveal}
              onChange={(e) => setReveal(e.target.checked)}
              className="accent-accent"
            />
            显敏感
          </label>
        </div>
      }
    >
      <DataTable
        rows={data?.items}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={[
          { key: 'name', header: '账号', cell: (r) => r.name },
          { key: 'login', header: '登录名', cell: (r) => r.loginname || '—' },
          { key: 'cur', header: '币种', cell: (r) => r.currency || '—' },
          {
            key: 'credit',
            header: '额度',
            className: 'num text-right',
            cell: (r) => fmtMoney(r.credit),
          },
          {
            key: 'bal',
            header: '可用额度',
            className: 'num text-right',
            cell: (r) => fmtMoney(r.balance_credit),
          },
          {
            key: 'chain',
            header: '代理链 (ag/su/co/d0)',
            cell: (r) => (
              <span className="text-xs font-mono">
                {r.ag || '—'} / {r.su || '—'} / {r.co || '—'} / {r.d0 || '—'}
              </span>
            ),
          },
          {
            key: 'ip',
            header: '登录 IP',
            cell: (r) => <code className="text-xs">{r.loginip || '—'}</code>,
          },
          { key: 'last', header: '最后活动', cell: (r) => fmtUnixTs(r.lastdate) },
        ]}
      />
    </Section>
  );
}
