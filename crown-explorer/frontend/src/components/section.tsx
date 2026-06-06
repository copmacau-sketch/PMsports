import type { ReactNode } from 'react';

export function Section({
  title,
  description,
  right,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {description ? (
            <p className="text-sm text-muted">{description}</p>
          ) : null}
        </div>
        {right}
      </div>
      {children}
    </section>
  );
}
