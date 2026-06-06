import type { ReactNode } from 'react';
import { classNames } from '@/lib/format';

export function Kpi({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  tone?: 'pos' | 'neg' | 'warn';
}) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className={classNames('kpi-value', tone)}>{value}</div>
      {hint ? <div className="text-xs text-muted">{hint}</div> : null}
    </div>
  );
}
