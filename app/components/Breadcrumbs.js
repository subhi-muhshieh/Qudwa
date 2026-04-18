'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaChevronLeft } from 'react-icons/fa';

const routeLabels = {
  '/admin': 'لوحة الإدارة',
  '/admin/messages': 'الرسائل',
  '/settings': 'الإعدادات',
  '/notifications': 'الإشعارات',
  '/profile': 'الملف الشخصي',
  '/activities': 'النشاطات',
  '/gallery': 'معرض الصور',
  '/about': 'عن الجمعية',
  '/contact': 'تواصل معنا',
  '/donate': 'ادعمنا',
  '/dashboard': 'الرئيسية',
};

export default function Breadcrumbs({ className = '' }) {
  const pathname = usePathname();

  // Don't show breadcrumbs on home, login, or root pages
  if (pathname === '/' || pathname === '/login' || pathname === '/dashboard') {
    return null;
  }

  // Build breadcrumb segments
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  // Always start with home
  breadcrumbs.push({
    label: 'الرئيسية',
    href: '/dashboard',
    icon: <FaHome className="text-xs" />,
  });

  // Build up the path segments
  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Check for nested routes in our labels map
    const label = routeLabels[currentPath] || segment;
    const isLast = index === segments.length - 1;

    breadcrumbs.push({
      label,
      href: isLast ? null : currentPath,
      isLast,
    });
  });

  return (
    <nav
      className={`flex items-center gap-2 text-sm py-4 px-4 md:px-8 ${className}`}
      aria-label="Breadcrumb"
      dir="rtl"
    >
      <ol className="flex items-center gap-2 flex-wrap">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center gap-2">
            {index > 0 && (
              <FaChevronLeft className="text-base-content/30 text-xs" aria-hidden="true" />
            )}

            {crumb.isLast || !crumb.href ? (
              <span
                className={`font-medium ${
                  crumb.isLast
                    ? 'text-primary'
                    : 'text-base-content/60'
                }`}
                aria-current={crumb.isLast ? 'page' : undefined}
              >
                <span className="flex items-center gap-1.5">
                  {crumb.icon}
                  {crumb.label}
                </span>
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="flex items-center gap-1.5 text-base-content/60 hover:text-primary transition-colors font-medium"
              >
                {crumb.icon}
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
