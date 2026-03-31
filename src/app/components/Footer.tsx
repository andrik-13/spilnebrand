import { Link, useParams } from 'react-router';
import { appConfig } from '../lib/config';
import { getLocalizedPath, getLocaleFromParam, ui } from '../lib/i18n';

export function Footer() {
  const { locale: localeParam } = useParams();
  const locale = getLocaleFromParam(localeParam);
  const copy = ui[locale];

  return (
    <footer className="bg-[#1A1816] text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-12 md:px-[80px] md:py-[60px]">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-sm">
            <div className="mb-5 text-[15px] uppercase tracking-[4px]">{copy.brand}</div>
            <p className="text-[13px] uppercase tracking-[2px] text-white/60">
              © 2026 {copy.brand}. {copy.footerRights}
            </p>
            <p className="mt-4 text-white/70">{copy.footerDelivery}</p>
          </div>

          <div className="grid gap-3 text-[13px] uppercase tracking-[2px] md:text-right">
            <Link to={getLocalizedPath(locale, '/catalog')} className="transition-colors hover:text-[#C4B5A0]">
              {copy.catalog}
            </Link>
            <Link to={`${getLocalizedPath(locale)}#about`} className="transition-colors hover:text-[#C4B5A0]">
              {copy.about}
            </Link>
            <Link to={getLocalizedPath(locale, '/admin')} className="transition-colors hover:text-[#C4B5A0]">
              Admin
            </Link>
            <a href={appConfig.telegramSupportUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#C4B5A0]">
              {copy.footerSupport}
            </a>
            <a href={appConfig.instagramUrl} target="_blank" rel="noreferrer" className="transition-colors hover:text-[#C4B5A0]">
              Instagram
            </a>
            <a href={`mailto:${appConfig.brandEmail}`} className="transition-colors hover:text-[#C4B5A0]">
              {appConfig.brandEmail}
            </a>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-[13px] uppercase tracking-[2px] text-white/60">
          {copy.footerMadeIn}
        </div>
      </div>
    </footer>
  );
}
