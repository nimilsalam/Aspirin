// Reusable, touch-friendly form controls for the assessment wizard.

interface Option<T> {
  value: T;
  label: string;
}

interface ChoiceGroupProps<T extends string> {
  label?: string;
  options: Option<T>[];
  value: T | undefined;
  onChange: (value: T) => void;
}

export function ChoiceGroup<T extends string>({
  label,
  options,
  value,
  onChange,
}: ChoiceGroupProps<T>) {
  return (
    <div>
      {label && <span className="field-label">{label}</span>}
      <div className="flex flex-col gap-3">
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`choice ${selected ? 'choice-selected' : ''}`}
              aria-pressed={selected}
            >
              <span>{opt.label}</span>
              <span
                className={`ml-3 h-5 w-5 shrink-0 rounded-full border-2 ${
                  selected ? 'border-brand-500 bg-brand-500' : 'border-ink-faint/40'
                }`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  placeholder?: string;
  help?: string;
  min?: number;
  max?: number;
}

export function NumberField({
  label,
  value,
  onChange,
  placeholder,
  help,
  min,
  max,
}: NumberFieldProps) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        className="field-input"
        value={value ?? ''}
        placeholder={placeholder}
        min={min}
        max={max}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === '' ? undefined : Number(v));
        }}
      />
      {help && <p className="mt-1.5 text-sm text-ink-soft">{help}</p>}
    </div>
  );
}

interface YesNoProps {
  label: string;
  value: boolean | undefined;
  onChange: (value: boolean) => void;
  yesLabel: string;
  noLabel: string;
}

export function YesNo({ label, value, onChange, yesLabel, noLabel }: YesNoProps) {
  return (
    <div>
      <span className="field-label">{label}</span>
      <div className="flex gap-3">
        {[
          { v: true, l: yesLabel },
          { v: false, l: noLabel },
        ].map(({ v, l }) => (
          <button
            key={String(v)}
            type="button"
            onClick={() => onChange(v)}
            className={`choice flex-1 justify-center ${value === v ? 'choice-selected' : ''}`}
            aria-pressed={value === v}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
