export const metadata = {
  title: 'معرض الصور | قدوة',
  description:
    'ألبومات ولحظات من نشاطات جمعية قدوة: تعلّم، ترفيه، ومجتمع واحد يبني جيلاً واعياً.',
  alternates: { canonical: 'https://qudwa.pages.dev/gallery' },
  openGraph: {
    title: 'معرض صور قدوة',
    description: 'ألبومات نشاطاتنا الترفيهية والتعليمية.',
    url: 'https://qudwa.pages.dev/gallery',
    type: 'website',
  },
};

export default function GalleryLayout({ children }) {
  return children;
}
