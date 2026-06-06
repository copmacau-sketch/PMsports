'use client';

import type { ReactNode } from 'react';

export type Column<T> = {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  className?: string;
  width?: string;
};

export function DataTable<T>({
  rows,
  columns,
  loading,
  empty = '— 无数据 —',
  rowKey,
  onRowClick,
}: {
  rows: T[] | undefined;
  columns: Column<T>[];
  loading?: boolean;
  empty?: ReactNode;
  rowKey: (row: T, idx: number) => string | number;
  onRowClick?: (row: T) => void;
}) {
  return (
    <div className="panel overflow-hidden">
      <div className="overflow-auto max-h-[70vh]">
        <table className="table">
          <thead className="sticky top-0">
            <tr>
              {columns.map((c) => (
                <th key={c.key} style={c.width ? { width: c.width } : undefined}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-muted py-8">
                  加载中…
                </td>
              </tr>
            ) : !rows || rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center text-muted py-8">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map((row, i) => (
                <tr
                  key={rowKey(row, i)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={onRowClick ? 'cursor-pointer' : ''}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={c.className}>
                      {c.cell(row)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
