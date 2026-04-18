export const metadata = {
  title: 'سجل النشاطات | قدوة',
  description:
    'أرشيف كامل لنشاطات جمعية قدوة — ورشات، رحلات، مبادرات تعليمية وترفيهية للأطفال والشباب.',
  alternates: { canonical: 'https://qudwa.pages.dev/activities' },
  openGraph: {
    title: 'سجل النشاطات | قدوة',
    description: 'تصفّح أرشيف نشاطات قدوة التعليمية والترفيهية.',
    url: 'https://qudwa.pages.dev/activities',
    type: 'website',
  },
};

export default function ActivitiesLayout({ children }) {
  return children;
}
