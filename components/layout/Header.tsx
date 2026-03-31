'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { appConfig } from '@/lib/config';
import { getLocalizedPath, locales, type Locale, ui } from '@/lib/i18n';

function switchLocaleInPath(pathname: string, nextLocale: Locale) {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${nextLocale}`;
  segments[0] = nextLocale;
  return `/${segments.join('/')}`;
}

export function Header({ locale }: { locale: Locale }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const copy = ui[locale];

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const navItems = useMemo(
    () => [
      { label: copy.home, to: getLocalizedPath(locale) },
      { label: copy.catalog, to: getLocalizedPath(locale, '/catalog') },
      { label: copy.about, to: `${getLocalizedPath(locale)}#about` },
    ],
    [copy.about, copy.catalog, copy.home, locale]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-accent/80 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-5 md:h-[76px] md:px-[80px]">
        <button
          type="button"
          onClick={() => setIsMenuOpen((value) => !value)}
          className="text-primary hover:text-muted md:hidden"
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link href={getLocalizedPath(locale)} className="text-[15px] uppercase tracking-[4px] text-primary">
          {copy.brand}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <Link key={item.to} href={item.to} className="text-[13px] uppercase tracking-[2px] text-muted hover:text-primary">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden items-center gap-2 md:flex">
            {locales.map((item) => {
              const active = item === locale;
              return (
                <Link key={item} href={switchLocaleInPath(pathname, item)} className={active ? 'text-primary' : 'text-muted hover:text-primary'}>
                  {item.toUpperCase()}
                </Link>
              );
            })}
          </div>
          <a href={appConfig.telegramSupportUrl} target="_blank" rel="noreferrer" className="relative text-primary hover:text-muted" aria-label="Open Telegram support">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-dark px-1 text-[10px] text-white">0</span>
          </a>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-accent bg-background px-5 py-6 md:hidden">
          <nav className="flex flex-col gap-4 text-center">
            {navItems.map((item) => (
              <Link key={item.to} href={item.to} className="text-primary hover:text-muted">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-5 flex justify-center gap-3 border-t border-accent pt-5 text-[13px] tracking-[2px]">
            {locales.map((item) => (
              <Link key={item} href={switchLocaleInPath(pathname, item)} className={item === locale ? 'text-primary' : 'text-muted'}>
                {item.toUpperCase()}
              </Link>
            ))}
          </div>
          <a href={appConfig.telegramSupportUrl} target="_blank" rel="noreferrer" className="mt-5 block text-center text-[13px] uppercase tracking-[2px] text-muted">
            {copy.footerSupport}
          </a>
        </div>
      )}
    </header>
  );
}
