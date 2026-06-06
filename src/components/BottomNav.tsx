import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';

const ITEMS = [
  { to: '/report', key: 'home', icon: '🏠' },
  { to: '/compare', key: 'compare', icon: '📈' },
  { to: '/history', key: 'history', icon: '🗂️' },
] as const;

export function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav className="sticky bottom-0 z-10 flex border-t border-ink-faint/15 bg-surface/95 backdrop-blur">
      {ITEMS.map((item) => (
        <NavLink
          key={item.key}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium ${
              isActive ? 'text-brand-600' : 'text-ink-faint'
            }`
          }
        >
          <span className="text-xl" aria-hidden>
            {item.icon}
          </span>
          {t(`nav.${item.key}`)}
        </NavLink>
      ))}
    </nav>
  );
}
