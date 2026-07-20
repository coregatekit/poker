export function Chip({ value, tone = 'brass' }: { value: number; tone?: 'brass' | 'sage' | 'clay' }) {
  return <span className={`poker-chip ${tone}`} aria-label={`${value} ชิป`}>{value}</span>;
}
