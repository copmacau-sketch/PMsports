'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table';
import { Section } from '@/components/section';
import { api, qs } from '@/lib/api';
import { fmtMoney, fmtUnixTs, pnlClass } from '@/lib/format';

type Bet = {
  ID: number;
  m_name: string;
  bet_time: number;
  gtype: string;
  gtype_label: string;
  ptype: string | null;
  ptype_label: string | null;
  wtype: string | null;
  wtype_label: string | null;
  league: string | null;
  team_h: string | null;
  team_c: string | null;
  spread: string | null;
  ioratio: string | null;
  score: string | null;
  bet_golds: string | null;
  valid_gold: string | null;
  mem_result: string | null;
  result: string | null;
  isResult: number | null;
  status: number | null;
  cancel: number | null;
  inball: string | null;
  isEdit: number | null;
  ticket_id: string | null;
  bet_ip: string | null;
  currency: string | null;
};

type Page = { total: number; items: Bet[] };

const GTYPES = ['', 'FT', 'BK', 'BS', 'TN', 'VB', 'BM', 'SK', 'ES', 'OP'];

export default function BetsPage() {
  const [q, setQ] = useState('');
  const [gtype, setGtype] = useState('');
  const [unresolved, setUnresolved] = useState(false);
  const [inball, setInball] = useState(false);
  const [cancelled, setCancelled] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['bets', q, gtype, unresolved, inball, cancelled],
    queryFn: () =>
      api<Page>(
        `/api/bets${qs({
          q,
          gtype,
          only_unresolved: unresolved || undefined,
          only_inball: inball || undefined,
          only_cancelled: cancelled || undefined,
          limit: 300,
        })}`,
      ),
  });

  return (
    <Section
      title="注单浏览器"
      description={`bet 表（命中 ${data?.total ?? '—'} 条）`}
      right={
        <div className="flex items-center gap-2 flex-wrap">
          <input
            className="input w-56"
            placeholder="会员 / 联赛 / 队伍"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <select
            className="input"
            value={gtype}
            onChange={(e) => setGtype(e.target.value)}
          >
            {GTYPES.map((g) => (
              <option key={g} value={g}>
                {g || '全部盘种'}
              </option>
            ))}
          </select>
          <Toggle on={unresolved} onChange={setUnresolved} label="未结算" />
          <Toggle on={inball} onChange={setInball} label="滚球" />
          <Toggle on={cancelled} onChange={setCancelled} label="已取消" />
        </div>
      }
    >
      <DataTable
        rows={data?.items}
        loading={isLoading}
        rowKey={(r) => r.ID}
        columns={[
          { key: 'time', header: '时间', cell: (r) => fmtUnixTs(r.bet_time) },
          { key: 'member', header: '会员', cell: (r) => r.m_name },
          {
            key: 'gtype',
            header: '盘种',
            cell: (r) => <span className="badge">{r.gtype_label || r.gtype}</span>,
          },
          {
            key: 'match',
            header: '比赛',
            cell: (r) => (
              <div className="text-xs">
                <div className="text-muted">{r.league}</div>
                <div>
                  {r.team_h}
                  <span className="text-muted"> vs </span>
                  {r.team_c}
                </div>
              </div>
            ),
          },
          {
            key: 'play',
            header: '玩法',
            cell: (r) => (
              <div className="text-xs">
                <div>{r.wtype_label || r.wtype || '—'}</div>
                <div className="text-muted">
                  {r.ptype_label || ''} {r.spread || ''} @{r.ioratio || '—'}
                </div>
              </div>
            ),
          },
          {
            key: 'score',
            header: '比分',
            cell: (r) => <code className="text-xs">{r.score || r.result || '—'}</code>,
          },
          {
            key: 'bet',
            header: '本金',
            className: 'num text-right',
            cell: (r) => fmtMoney(r.bet_golds),
          },
          {
            key: 'result',
            header: '会员结果',
            className: 'num text-right',
            cell: (r) => (
              <span className={pnlClass(r.mem_result)}>{fmtMoney(r.mem_result)}</span>
            ),
          },
          {
            key: 'flags',
            header: '状态',
            cell: (r) => (
              <div className="flex flex-wrap gap-1">
                {r.cancel ? <span className="badge text-warning">取消</span> : null}
                {r.isEdit ? <span className="badge text-warning">改单</span> : null}
                {r.inball ? <span className="badge">滚球</span> : null}
                {!r.isResult ? <span className="badge text-muted">未结</span> : null}
              </div>
            ),
          },
        ]}
      />
    </Section>
  );
}

function Toggle({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="badge cursor-pointer select-none">
      <input
        type="checkbox"
        checked={on}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-accent"
      />
      {label}
    </label>
  );
}
