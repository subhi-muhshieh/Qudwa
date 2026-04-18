export const metadata = {
  title: 'عن الجمعية | قدوة',
  description:
    'تعرّف على جمعية قدوة: رسالتنا، قيمنا، الفريق الإداري، وبرامجنا التربوية الهادفة لبناء جيل واعٍ ومسؤول.',
  alternates: { canonical: 'https://qudwa.pages.dev/about' },
  openGraph: {
    title: 'عن جمعية قدوة',
    description: 'رسالتنا، فريقنا، وقيمنا — جيلٌ يبني... أثرٌ يبقى.',
    url: 'https://qudwa.pages.dev/about',
    type: 'website',
  },
};

export default function AboutLayout({ children }) {
  return children;
}
