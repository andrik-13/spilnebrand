import { type Locale } from '@/lib/i18n';

export default function AdminLoginPage({ params, searchParams }: { params: { locale: Locale }; searchParams: { next?: string; error?: string } }) {
  const locale = params.locale;
  const hasError = searchParams.error === '1';
  const nextPath = searchParams.next || `/${locale}/admin`;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-[560px] items-center px-5 py-16">
      <div className="w-full border border-accent bg-white/60 p-6 md:p-8">
        <p className="mb-2 text-[13px] uppercase tracking-[2px] text-muted">Admin Login</p>
        <h2 className="mb-3">Protected access</h2>
        <p className="mb-6 text-muted">This login is temporary and uses `ADMIN_PASSWORD` from your local environment.</p>

        <form action="/api/admin/login" method="post" className="space-y-4">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="next" value={nextPath} />

          <label className="block">
            <span className="mb-2 block text-[13px] uppercase tracking-[2px] text-muted">Password</span>
            <input type="password" name="password" className="w-full border border-accent bg-white px-4 py-3 outline-none" required />
          </label>

          {hasError ? <p className="text-sm text-[#9b3d2f]">Password is incorrect. Try again.</p> : null}

          <button type="submit" className="inline-flex cursor-pointer items-center justify-center bg-dark px-8 py-4 text-[14px] uppercase tracking-[1.5px] text-white transition-colors hover:bg-primary">
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}
