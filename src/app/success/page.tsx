import Link from 'next/link';

export default function SuccessPage() {
  return (
    <div className="bg-white flex flex-col items-center justify-center min-h-screen text-center p-6" dir="rtl">
      <div className="max-w-md">
        <img src="https://irispetals.com/wp-content/uploads/2026/01/H-H-100.jpg" alt="Iris Petals Logo" className="w-48 mx-auto mb-8 object-contain" />
        <h1 className="text-5xl italic mb-6 serif">Thank You</h1>
        <p className="text-gray-500 mb-10 leading-relaxed font-light">
          تم استلام طلبك وتوصيل البيانات إلى لوحة التحكم بنجاح، شكراً لثقتكم. سيقوم المشرف بالتحقق من عملية الدفع ثم البدء فوراً في تنسيق باقتك للإرسال في الموعد المحدد.
        </p>
        <Link href="/" className="inline-block py-4 px-12 bg-black text-white text-xs font-bold uppercase hover:bg-gray-800 transition">العودة للمتجر</Link>
      </div>
    </div>
  );
}
