export function CoachTape({ children, tone = 'tip' }: { children: React.ReactNode; tone?: 'tip' | 'warning' }) {
  return <aside className={`coach-tape ${tone}`} aria-live="polite"><span aria-hidden="true">{tone === 'tip' ? '✦' : '!'}</span><div>{children}</div></aside>;
}
