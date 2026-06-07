import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';

interface QRShareProps {
  /** URL to encode. Defaults to the current site origin. */
  url?: string;
}

/** A scannable QR card — hold up the screen and others can open the app. */
export function QRShare({ url }: QRShareProps) {
  const { t } = useTranslation();
  const link = url ?? (typeof window !== 'undefined' ? window.location.origin : '');

  return (
    <section className="card flex flex-col items-center text-center">
      <h3 className="text-base font-semibold text-ink">{t('common.scanTitle')}</h3>
      <p className="mb-4 mt-1 text-sm text-ink-soft">{t('common.scanSubtitle')}</p>
      <div className="rounded-2xl bg-white p-3 shadow-card">
        <QRCodeSVG
          value={link}
          size={168}
          level="M"
          marginSize={0}
          bgColor="#ffffff"
          fgColor="#0b8a6f"
        />
      </div>
      <p className="mt-3 break-all text-xs text-ink-faint">{link}</p>
    </section>
  );
}
