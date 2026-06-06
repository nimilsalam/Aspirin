import type { ConditionResult } from '../lib/types';
import { CONDITION_ICON, SEVERITY_DOT } from '../lib/ui';

interface DomainCardProps {
  result: ConditionResult;
  name: string;
  statusLabel: string;
  onClick?: () => void;
}

export function DomainCard({ result, name, statusLabel, onClick }: DomainCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="card flex items-center gap-3 text-left transition active:scale-[0.99]"
    >
      <span className="text-2xl" aria-hidden>
        {CONDITION_ICON[result.key]}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-semibold text-ink">{name}</span>
        <span className="mt-0.5 flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${SEVERITY_DOT[result.severity]}`} />
          <span className="truncate text-sm text-ink-soft">
            {result.valueLabel ?? statusLabel}
          </span>
        </span>
      </span>
      <span className="text-ink-faint" aria-hidden>
        ›
      </span>
    </button>
  );
}
