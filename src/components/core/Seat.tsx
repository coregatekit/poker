import type { ReactNode } from 'react';

export function Seat({ name, position, active, children }: { name: string; position?: string; active?: boolean; children?: ReactNode }) {
  return <div className={`poker-seat ${active ? 'active' : ''}`} aria-current={active ? 'step' : undefined}>
    <strong>{name}</strong>{position && <small>{position}</small>}{children}
  </div>;
}
