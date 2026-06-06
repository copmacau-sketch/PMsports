'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Section } from '@/components/section';
import { DataTable } from '@/components/data-table';
import { api, qs } from '@/lib/api';
import { fmtUnixTs } from '@/lib/format';

type Msg = {
  id: number;
  name: string;
  ndate: string | null;
  ntime: number | null;
  dqtime: number | null;
  type: number | null;
  level: number | null;
  readcount: number | null;
  isAlert: number | null;
  body: string;
};

type Page = { total: number; items: Msg[] };

const LANGS = [
  { value: 'zh', label: '中文 (简)' },
  { value: 'tw', label: '中文 (繁)' },
  { value: 'en', label: 'English' },
];

export default function MessagesPage() {
  const [lang, setLang] = useState<'zh' | 'tw' | 'en'>('zh');
  const [q, setQ] = useState('');
  const { data, isLoading } = useQuery({
    queryKey: ['messages', lang, q],
    queryFn: () =>
      api<Page>(`/api/messages${qs({ lang, q, limit: 200 })}`),
  });

  return (
    <Section
      title="公告 / 推送"
      description={`message 表（命中 ${data?.total ?? '—'} 条）`}
      right={
        <div className="flex items-center gap-2">
          <select
            className="input"
            value={lang}
            onChange={(e) => setLang(e.target.value as 'zh' | 'tw' | 'en')}
          >
            {LANGS.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
          <input
            className="input w-64"
            placeholder="搜索内容 / 标题"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      }
    >
      <DataTable
        rows={data?.items}
        loading={isLoading}
        rowKey={(r) => r.id}
        columns={[
          { key: 'date', header: '日期', cell: (r) => r.ndate || '—' },
          { key: 'start', header: '开始', cell: (r) => fmtUnixTs(r.ntime) },
          { key: 'end', header: '结束', cell: (r) => fmtUnixTs(r.dqtime) },
          { key: 'name', header: '标题', cell: (r) => r.name },
          {
            key: 'body',
            header: '内容',
            cell: (r) => (
              <div className="text-xs leading-relaxed max-w-2xl whitespace-pre-wrap">
                {r.body}
              </div>
            ),
          },
          {
            key: 'read',
            header: '已读',
            className: 'num text-right',
            cell: (r) => r.readcount ?? 0,
          },
          {
            key: 'flag',
            header: '标志',
            cell: (r) =>
              r.isAlert ? <span className="badge text-warning">弹窗</span> : '—',
          },
        ]}
      />
    </Section>
  );
}
