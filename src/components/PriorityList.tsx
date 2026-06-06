import type { Outcome } from '../lib/types';
import { CONDITION_ICON, SEVERITY_DOT } from '../lib/ui';

interface PriorityListProps {
  outcomes: Outcome[];
  onSelect: (key: string) => void;
}

/** "Your top things to do" — the campaign hook at the top of the report. */
export function PriorityList({ outcomes, onSelect }: PriorityListProps) {
  return (
    <div className="flex flex-col gap-3">
      {outcomes.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onSelect(o.key)}
          className="card flex items-start gap-3 text-left transition active:scale-[0.99]"
        >
          <span className="text-2xl" aria-hidden>
            {CONDITION_ICON[o.key]}
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${SEVERITY_DOT[o.severity]}`} />
              <span className="text-base font-semibold text-ink">{o.content.title}</span>
            </span>
            <span className="mt-1 block text-sm leading-snug text-ink-soft">
              {o.content.actionSteps[0]}
            </span>
          </span>
          <span className="mt-1 text-ink-faint" aria-hidden>
            ›
          </span>
        </button>
      ))}
    </div>
  );
}
