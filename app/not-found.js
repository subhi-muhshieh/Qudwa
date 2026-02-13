import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-primary/20 mb-4">404</div>
        <h1 className="text-3xl font-bold text-base-content mb-3">
          الصفحة غير موجودة
        </h1>
        <p className="text-base-content/50 mb-8">
          عذراً، لا يمكننا العثور على الصفحة التي تبحث عنها
        </p>
        <Link 
          href="/" 
          className="btn btn-primary rounded-full px-8 text-white"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}