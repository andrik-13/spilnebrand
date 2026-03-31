import { Navigate, Outlet, useParams } from 'react-router';
import { Footer } from './Footer';
import { Header } from './Header';
import { isLocale } from '../lib/i18n';

export function Layout() {
  const { locale } = useParams();

  if (!isLocale(locale)) {
    return <Navigate to="/ua" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF7] text-[#1A1816]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
