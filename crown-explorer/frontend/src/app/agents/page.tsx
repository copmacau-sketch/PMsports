'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table';
import { Section } from '@/components/section';
import { api, qs } from '@/lib/api';
import { fmtMoney, fmtUnixTs, pnlClass } from '@/lib/format';

type Agent = {
  id: number;
  nid: string;
  name: string;
  loginname: string | null;
  level: number;
  level_label: string;
  status: number;
  isout: number;
  credit: number | null;
  winloss: number | null;
  dfwinloss: number | null;
  pay_type: number | null;
  currency: string | null;
  manager_uid: string | null;
  pri: string | null;
  loginip: string | null;
  email: string | null;
  adddate: number | null;
  lastdate: number | null;
};

const LEVELS = [
  { value: '',  label: '全部' },
  { value: '1', label: 'D0 总公司' },
  { value: '2', label: 'D1 公司' },
  { value: '3', label: 'D2 大股' },
  { value: '4', label: 'D3 代理' },
];

export default function AgentsPage() {
  const [level, setLevel] = useState('');
  const [reveal, setReveal] = useState(false);
  const { data, isLoading } = useQuery({
    queryKey: ['agents', level, reveal],
    queryFn: () => api<Agent[]>(`/api/agents${qs({ level, reveal })}`),
  });

  return (
    <Section
      title="代理层级"
      description="rank 表：四层 D0 → D1 → D2 → D3，挂载会员的 ag/su/co/d0 字段直接对应这里的 name。"
      right={
        <div className="flex items-center gap-2">
          <select
            className="input"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            {LEVELS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
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
        rows={data}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={[
          {
            key: 'level',
            header: '层级',
            cell: (r) => <span className="badge">{r.level_label || r.level}</span>,
            width: '120px',
          },
          { key: 'name', header: '账号', cell: (r) => r.name },
          { key: 'login', header: '登录名', cell: (r) => r.loginname || '—' },
          { key: 'mgr', header: '上级 UID', cell: (r) => r.manager_uid || '—' },
          { key: 'pri', header: '权限链', cell: (r) => <code className="text-xs">{r.pri || '—'}</code> },
          {
            key: 'credit',
            header: '额度',
            className: 'num text-right',
            cell: (r) => fmtMoney(r.credit),
          },
          {
            key: 'wl',
            header: '输赢',
            className: 'num text-right',
            cell: (r) => (
              <span className={pnlClass(r.winloss)}>{fmtMoney(r.winloss)}</span>
            ),
          },
          { key: 'ip', header: '登录 IP', cell: (r) => <code className="text-xs">{r.loginip || '—'}</code> },
          { key: 'last', header: '最后活动', cell: (r) => fmtUnixTs(r.lastdate) },
        ]}
      />
    </Section>
  );
}
