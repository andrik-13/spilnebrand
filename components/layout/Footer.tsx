import Link from 'next/link';
import { appConfig } from '@/lib/config';
import { getLocalizedPath, type Locale, ui } from '@/lib/i18n';

export function Footer({ locale }: { locale: Locale }) {
  const copy = ui[locale];

  return (
    <footer className="bg-primary px-5 py-12 text-white md:px-[80px]">
      <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-2">
        <div>
          <p className="text-[15px] uppercase tracking-[4px]">{copy.brand}</p>
          <p className="mt-4 max-w-sm text-white/70">© 2026 SPIL&apos;NE. {copy.footerRights}</p>
        </div>

        <div className="grid gap-3 md:justify-items-end">
          <Link href={getLocalizedPath(locale, '/catalog')} className="text-white/80 hover:text-white">{copy.catalog}</Link>
          <Link href={`${getLocalizedPath(locale)}#about`} className="text-white/80 hover:text-white">{copy.about}</Link>
          <a href={appConfig.telegramSupportUrl} target="_blank" rel="noreferrer" className="text-white/80 hover:text-white">{copy.footerSupport}</a>
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-[1280px] border-t border-white/15 pt-6 text-sm text-white/60">
        {copy.footerMadeIn}
      </div>
    </footer>
  );
}
