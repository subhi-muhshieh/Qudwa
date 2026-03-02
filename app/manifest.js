export default function manifest() {
  return {
    name: 'جمعية قدوة | Qudwa Association',
    short_name: 'قدوة',
    description: 'جيلٌ يبني... أثرٌ يبقى - جمعية تربوية غير ربحية',
    start_url: '/',
    display: 'standalone',
    background_color: '#f0f9ff',
    theme_color: '#1281c3',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'ar',
    dir: 'rtl',
    icons: [
      {
        src: '/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      }
    ],
    categories: ['education', 'nonprofit', 'community'],
    screenshots: [
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'جمعية قدوة - الصفحة الرئيسية'
      },
      {
        src: '/screenshot-mobile.png',
        sizes: '375x667',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'جمعية قدوة - نسخة الجوال'
      }
    ]
  }
}
