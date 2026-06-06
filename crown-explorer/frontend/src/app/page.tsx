'use client';

import { useQuery } from '@tanstack/react-query';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Kpi } from '@/components/kpi';
import { Section } from '@/components/section';
import { DataTable } from '@/components/data-table';
import { api } from '@/lib/api';
import { fmtMoney, fmtUnixTs, pnlClass } from '@/lib/format';

type Overview = {
  counts: Record<string, number>;
  bet_totals: {
    bet_total: number | null;
    valid_total: number | null;
    member_pnl: number | null;
    ag_pnl: number | null;
    co_pnl: number | null;
    d0_pnl: number | null;
    first_bet_ts: number | null;
    last_bet_ts: number | null;
  };
};

type ByDay = { day: string; bets: number; bet_total: number; member_pnl: number };
type ByGtype = {
  gtype: string;
  gtype_label: string;
  bets: number;
  bet_total: number;
  member_pnl: number | null;
};
type TopMember = { member: string; bets: number; bet_total: number; member_pnl: number };

export default function DashboardPage() {
  const overview = useQuery({
    queryKey: ['overview'],
    queryFn: () => api<Overview>('/api/stats/overview'),
  });
  const byDay = useQuery({
    queryKey: ['bets_by_day'],
    queryFn: () => api<ByDay[]>('/api/stats/bets_by_day?limit=120'),
  });
  const byGtype = useQuery({
    queryKey: ['bets_by_gtype'],
    queryFn: () => api<ByGtype[]>('/api/stats/bets_by_gtype'),
  });
  const topMembers = useQuery({
    queryKey: ['top_members'],
    queryFn: () => api<TopMember[]>('/api/stats/top_members?limit=10'),
  });

  const ov = overview.data;
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Kpi label="管理员" value={ov?.counts.admins ?? '—'} />
        <Kpi label="代理" value={ov?.counts.agents ?? '—'} />
        <Kpi label="会员" value={ov?.counts.members ?? '—'} />
        <Kpi label="注单" value={ov?.counts.bets ?? '—'} />
        <Kpi label="资金流水条目" value={ov?.counts.credit_log_rows ?? '—'} />
        <Kpi label="会员操作日志" value={ov?.counts.member_record_rows ?? '—'} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi
          label="累计投注额"
          value={fmtMoney(ov?.bet_totals.bet_total ?? null)}
          hint={`有效 ${fmtMoney(ov?.bet_totals.valid_total ?? null)}`}
        />
        <Kpi
          label="会员盈亏"
          value={fmtMoney(ov?.bet_totals.member_pnl ?? null)}
          tone={
            (ov?.bet_totals.member_pnl ?? 0) > 0
              ? 'pos'
              : (ov?.bet_totals.member_pnl ?? 0) < 0
                ? 'neg'
                : undefined
          }
        />
        <Kpi
          label="代理盈亏 (AG)"
          value={fmtMoney(ov?.bet_totals.ag_pnl ?? null)}
        />
        <Kpi
          label="时间范围"
          value={
            <span className="text-base font-medium">
              {fmtUnixTs(ov?.bet_totals.first_bet_ts ?? null)}
              <br />
              {fmtUnixTs(ov?.bet_totals.last_bet_ts ?? null)}
            </span>
          }
        />
      </div>

      <Section title="每日下注趋势" description="近 120 天有数据的日期">
        <div className="panel panel-padded h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={byDay.data ?? []}>
              <CartesianGrid stroke="rgb(48 54 61)" strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="rgb(125 133 144)" fontSize={11} />
              <YAxis stroke="rgb(125 133 144)" fontSize={11} />
              <Tooltip
                contentStyle={{
                  background: 'rgb(22 27 34)',
                  border: '1px solid rgb(48 54 61)',
                  borderRadius: 6,
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="bet_total"
                name="投注额"
                stroke="rgb(99 102 241)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="bets"
                name="笔数"
                stroke="rgb(74 222 128)"
                strokeWidth={1.5}
                dot={false}
                yAxisId={0}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <div className="grid lg:grid-cols-2 gap-6">
        <Section title="按盘种分布" description="bet.gtype">
          <div className="panel panel-padded h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byGtype.data ?? []}>
                <CartesianGrid stroke="rgb(48 54 61)" strokeDasharray="3 3" />
                <XAxis dataKey="gtype_label" stroke="rgb(125 133 144)" fontSize={11} />
                <YAxis stroke="rgb(125 133 144)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: 'rgb(22 27 34)',
                    border: '1px solid rgb(48 54 61)',
                    borderRadius: 6,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="bets" name="笔数" fill="rgb(99 102 241)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="投注额 Top 10 会员" description="按投注额降序">
          <DataTable
            rows={topMembers.data}
            loading={topMembers.isLoading}
            rowKey={(r) => r.member}
            columns={[
              { key: 'm', header: '会员', cell: (r) => r.member },
              {
                key: 'n',
                header: '笔数',
                className: 'num text-right',
                cell: (r) => r.bets,
              },
              {
                key: 't',
                header: '投注额',
                className: 'num text-right',
                cell: (r) => fmtMoney(r.bet_total),
              },
              {
                key: 'pnl',
                header: '会员盈亏',
                className: 'num text-right',
                cell: (r) => (
                  <span className={pnlClass(r.member_pnl)}>
                    {fmtMoney(r.member_pnl)}
                  </span>
                ),
              },
            ]}
          />
        </Section>
      </div>
    </div>
  );
}
