import JsonLd from '../components/JsonLd';
import { faqs } from './faqData';

export const metadata = {
  title: 'الأسئلة الشائعة | قدوة',
  description:
    'إجابات على أكثر الأسئلة شيوعاً حول جمعية قدوة: التسجيل، الأنشطة، الفئات العمرية، الخصوصية، وكيفية التواصل.',
  alternates: { canonical: 'https://qudwa.pages.dev/faq' },
  openGraph: {
    title: 'الأسئلة الشائعة | قدوة',
    description: 'إجابات وافية على الأسئلة الأكثر شيوعاً حول منصة قدوة.',
    url: 'https://qudwa.pages.dev/faq',
    type: 'website',
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  })),
};

export default function FaqLayout({ children }) {
  return (
    <>
      <JsonLd data={faqSchema} id="ld-faq" />
      {children}
    </>
  );
}
