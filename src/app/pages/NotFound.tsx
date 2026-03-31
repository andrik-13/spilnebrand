import { Link, useParams } from 'react-router';
import { Button } from '../components/Button';
import { getLocalizedPath, getLocaleFromParam, ui } from '../lib/i18n';
import { usePageMeta } from '../lib/seo';

export function NotFound() {
  const { locale: localeParam } = useParams();
  const locale = getLocaleFromParam(localeParam);
  const copy = ui[locale];

  usePageMeta(copy.notFoundTitle, copy.notFoundText);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-5">
      <div className="max-w-lg text-center">
        <h2 className="mb-4">{copy.notFoundTitle}</h2>
        <p className="mb-8 text-[#6B6560]">{copy.notFoundText}</p>
        <Link to={getLocalizedPath(locale, '/catalog')}>
          <Button variant="secondary">{copy.backToCatalog}</Button>
        </Link>
      </div>
    </div>
  );
}
