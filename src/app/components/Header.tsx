import { Link, useLocation, useParams } from 'react-router';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { appConfig } from '../lib/config';
import { getLocalizedPath, getLocaleFromParam, locales, type Locale, ui } from '../lib/i18n';

function switchLocaleInPath(pathname: string, nextLocale: Locale) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return `/${nextLocale}`;
  }
  segments[0] = nextLocale;
  return `/${segments.join('/')}`;
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { locale: localeParam } = useParams();
  const locale = getLocaleFromParam(localeParam);
  const copy = ui[locale];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navItems = useMemo(
    () => [
      { label: copy.home, to: getLocalizedPath(locale) },
      { label: copy.catalog, to: getLocalizedPath(locale, '/catalog') },
      { label: copy.about, to: `${getLocalizedPath(locale)}#about` },
    ],
    [copy.about, copy.catalog, copy.home, locale]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#C4B5A0]/80 bg-[#FAFAF7]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 md:h-[76px] md:px-[80px]">
        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="text-[#1A1816] transition-colors hover:text-[#6B6560] md:hidden"
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link to={getLocalizedPath(locale)} className="text-[15px] uppercase tracking-[4px] text-[#1A1816]">
          {copy.brand}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-[13px] uppercase tracking-[2px] text-[#6B6560] transition-colors hover:text-[#1A1816]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden items-center gap-2 md:flex">
            {locales.map((item) => {
              const active = item === locale;
              return (
                <Link
                  key={item}
                  to={switchLocaleInPath(location.pathname, item)}
                  className={active ? 'text-[#1A1816]' : 'text-[#6B6560] transition-colors hover:text-[#1A1816]'}
                >
                  {item.toUpperCase()}
                </Link>
              );
            })}
          </div>
          <a
            href={appConfig.telegramSupportUrl}
            target="_blank"
            rel="noreferrer"
            className="relative text-[#1A1816] transition-colors hover:text-[#6B6560]"
            aria-label="Open Telegram support"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2C2420] px-1 text-[10px] text-white">
              0
            </span>
          </a>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-[#C4B5A0] bg-[#FAFAF7] px-5 py-6 md:hidden">
          <nav className="flex flex-col gap-4 text-center">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsMenuOpen(false)}
                className="text-[#1A1816] transition-colors hover:text-[#6B6560]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex justify-center gap-3 border-t border-[#C4B5A0] pt-5 text-[13px] tracking-[2px]">
            {locales.map((item) => (
              <Link
                key={item}
                to={switchLocaleInPath(location.pathname, item)}
                onClick={() => setIsMenuOpen(false)}
                className={item === locale ? 'text-[#1A1816]' : 'text-[#6B6560]'}
              >
                {item.toUpperCase()}
              </Link>
            ))}
          </div>
          <a
            href={appConfig.telegramSupportUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-5 block text-center text-[13px] uppercase tracking-[2px] text-[#6B6560]"
          >
            {copy.footerSupport}
          </a>
        </div>
      )}
    </header>
  );
}
