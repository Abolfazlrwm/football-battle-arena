/**
 * One stat row in a Team A vs Team B comparison: value — label — value,
 * with two bars that grow toward each other from opposite edges. Used
 * by both the freeform BattleComparator and the static battle detail
 * page. Colors are passed as raw hex (not the --accent cascade) since
 * two teams' colors are on screen at once here.
 */
export function ComparisonRow({
  label,
  aValue,
  bValue,
  accentA,
  accentB,
  max = 100,
}: {
  label: string;
  aValue: number;
  bValue: number;
  accentA: string;
  accentB: string;
  max?: number;
}) {
  const aPct = Math.min(100, Math.max(0, (aValue / max) * 100));
  const bPct = Math.min(100, Math.max(0, (bValue / max) * 100));

  return (
    <div>
      <div className="flex items-center justify-between font-body text-label text-arena-mist">
        <span className="text-arena-fog">{aValue}</span>
        <span>{label}</span>
        <span className="text-arena-fog">{bValue}</span>
      </div>
      <div className="mt-1.5 flex items-center gap-1.5">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-arena-charcoal-raised">
          <div
            className="ml-auto h-full rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${aPct}%`, backgroundColor: accentA }}
          />
        </div>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-arena-charcoal-raised">
          <div
            className="h-full rounded-full transition-[width] duration-500 ease-out"
            style={{ width: `${bPct}%`, backgroundColor: accentB }}
          />
        </div>
      </div>
    </div>
  );
}
