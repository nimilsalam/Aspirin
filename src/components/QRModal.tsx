import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';

interface QRModalProps {
  url: string;
  onClose: () => void;
}

/** Full-screen QR overlay — hold up the screen for others to scan. */
export function QRModal({ url, onClose }: QRModalProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard?.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-sm rounded-xl2 bg-surface p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold text-ink">{t('common.scanTitle')}</h2>
        <p className="mb-5 mt-1 text-sm text-ink-soft">{t('common.scanSubtitle')}</p>

        <div className="mx-auto inline-block rounded-2xl bg-white p-4 shadow-card">
          <QRCodeSVG value={url} size={240} level="M" marginSize={0} bgColor="#ffffff" fgColor="#0b8a6f" />
        </div>

        <p className="mt-4 break-all text-xs text-ink-faint">{url}</p>

        <div className="mt-6 flex flex-col gap-3">
          <button type="button" className="btn-primary" onClick={copy}>
            {copied ? t('common.copied') : t('common.copyLink')}
          </button>
          <button type="button" className="btn-ghost" onClick={onClose}>
            {t('common.close')}
          </button>
        </div>
      </div>
    </div>
  );
}
