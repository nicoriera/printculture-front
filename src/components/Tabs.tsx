"use client";

interface TabsProps<T extends string> {
  tabs: readonly T[];
  active: T;
  onChange: (tab: T) => void;
}

/** Underline tab bar used on the feed and chat screens (maquette CULTURHUB). */
export default function Tabs<T extends string>({ tabs, active, onChange }: TabsProps<T>) {
  return (
    <div className="flex gap-8 border-b border-ink/10">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`relative pb-3 text-sm tracking-wide transition-colors ${
            active === t ? "text-ink" : "text-muted hover:text-ink"
          }`}>
          {t}
          {active === t && (
            <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-rose rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
