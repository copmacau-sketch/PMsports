'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table';
import { Section } from '@/components/section';
import { api, qs } from '@/lib/api';
import { fmtMoney, fmtUnixTs, pnlClass } from '@/lib/format';

type Row = {
  id: number;
  nid: string;
  s_name: string | null;
  ss_name: string | null;
  type: string | null;
  old_cash: string | null;
  new_cash: string | null;
  cash: string | null;
  usertype: string | null;
  logintime: string | null;
};

type Page = { total: number; items: Row[] };

export default function CashflowPage() {
  const [q, setQ] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['cashflow', q],
    queryFn: () => api<Page>(`/api/cashflow${qs({ q, limit: 500 })}`),
  });

  return (
    <Section
      title="资金流水"
      description={`credit_log 表（命中 ${data?.total ?? '—'} 条）— 旧额度 → 新额度 → 变动金额`}
      right={
        <input
          className="input w-64"
          placeholder="nid / 操作者 (s_name)"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      }
    >
      <DataTable
        rows={data?.items}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={[
          {
            key: 'time',
            header: '时间',
            cell: (r) =>
              fmtUnixTs(r.logintime ? Number(r.logintime) : null),
          },
          {
            key: 'who',
            header: '账号',
            cell: (r) => <code className="text-xs">{r.nid?.slice(0, 16)}…</code>,
          },
          { key: 'op', header: '操作者', cell: (r) => r.s_name || '—' },
          { key: 'sub', header: '执行者', cell: (r) => r.ss_name || '—' },
          {
            key: 'type',
            header: '类型',
            cell: (r) => <span className="badge">{r.type || '—'}</span>,
          },
          {
            key: 'ut',
            header: '主体',
            cell: (r) => r.usertype || '—',
          },
          {
            key: 'old',
            header: '旧额度',
            className: 'num text-right',
            cell: (r) => fmtMoney(r.old_cash),
          },
          {
            key: 'new',
            header: '新额度',
            className: 'num text-right',
            cell: (r) => fmtMoney(r.new_cash),
          },
          {
            key: 'd',
            header: '变动',
            className: 'num text-right',
            cell: (r) => (
              <span className={pnlClass(r.cash)}>{fmtMoney(r.cash)}</span>
            ),
          },
        ]}
      />
    </Section>
  );
}
