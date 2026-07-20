import type { ReactNode } from 'react';

export function Table({ children, label = 'โต๊ะโป๊กเกอร์' }: { children: ReactNode; label?: string }) {
  return <div className="table-felt poker-table" role="group" aria-label={label}>{children}</div>;
}
