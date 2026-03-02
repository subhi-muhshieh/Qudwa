export default function sitemap() {
  const baseUrl = 'https://qudwa.pages.dev';
  
  const routes = [
    '',
    '/about',
    '/activities',
    '/contact',
    '/donate',
    '/faq',
    '/gallery',
    '/login',
    '/dashboard',
    '/profile',
    '/settings',
    '/admin',
    '/notifications',
  ];

  const sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return sitemap;
}
