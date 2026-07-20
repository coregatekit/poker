import type { ReactNode } from 'react';

export function Lab({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return <section className="poker-lab">
    <header className="lab-head"><h3>{title}</h3><p>{description}</p></header>
    <div className="lab-body">{children}</div>
  </section>;
}
