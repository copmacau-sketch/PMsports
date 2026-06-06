// Formatting helpers shared by every page.

export function fmtMoney(v: number | string | null | undefined): string {
  if (v === null || v === undefined || v === '') return '—';
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) return '—';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 })
    .format(n);
}

export function fmtUnixTs(ts: number | string | null | undefined): string {
  if (ts === null || ts === undefined || ts === '' || ts === 0) return '—';
  const n = typeof ts === 'number' ? ts : Number(ts);
  if (!Number.isFinite(n) || n <= 0) return '—';
  return new Date(n * 1000).toISOString().replace('T', ' ').slice(0, 19);
}

export function classNames(...x: (string | false | null | undefined)[]): string {
  return x.filter(Boolean).join(' ');
}

export function pnlClass(v: number | string | null | undefined): string {
  if (v === null || v === undefined || v === '') return '';
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n) || n === 0) return '';
  return n > 0 ? 'pos' : 'neg';
}
