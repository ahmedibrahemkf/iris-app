"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [config, setConfig] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [amount, setAmount] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    location: "",
    roseColor: "",
    wrapColor: "",
    cardMessage: "",
    deliveryDate: "",
    deliveryTime: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(data => {
      const parsedRoses = JSON.parse(data.roseColors || '[]');
      const parsedWraps = JSON.parse(data.wrapColors || '[]');
      setConfig({
        ...data,
        roseColors: parsedRoses,
        wrapColors: parsedWraps
      });
      setFormData(f => ({
        ...f,
        roseColor: parsedRoses[0] || "",
        wrapColor: parsedWraps[0] || "",
      }));
    });
  }, []);

  const openModal = (product: string, price: number) => {
    setSelectedProduct(product);
    setAmount(price);
    setModalOpen(true);
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setFormData(f => ({ ...f, location: `https://www.google.com/maps?q=${pos.coords.latitude},${pos.coords.longitude}` }));
      });
    }
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: selectedProduct,
          amount: amount,
          customerName: formData.name,
          customerPhone: formData.phone,
          deliveryAddress: formData.address,
          geoLocation: formData.location || 'غير متوفر',
          roseColor: formData.roseColor,
          wrapColor: formData.wrapColor,
          cardMessage: formData.cardMessage || 'بدون رسالة',
          deliveryDate: formData.deliveryDate,
          deliveryTime: formData.deliveryTime,
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('خطأ في الاتصال ببوابة الدفع تأكد من مفاتيح OPay');
      }
    } catch (err) {
      alert('حدث خطأ أثناء معالجة الطلب');
    }
    setLoading(false);
  };

  if (!config) return <div className="h-screen flex items-center justify-center font-bold text-gray-500 tracking-widest text-sm uppercase">Loading...</div>;

  return (
    <>
      <a href="https://wa.me/201055835754" target="_blank" rel="noreferrer"
        className="fixed bottom-8 left-8 bg-[#25d366] text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-2xl z-[1000] hover:scale-110 transition">
        <i className="fab fa-whatsapp"></i>
      </a>

      <nav className="flex flex-col items-center py-6 border-b bg-white/95 shadow-sm">
        <img src="https://irispetals.com/wp-content/uploads/2026/01/H-H-100.jpg" alt="Iris Petals"
          className="w-[320px] mb-3 object-contain" />
        <div className="flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          <a href="#products" className="hover:text-black transition">المنتجات</a>
          <a href="#faq" className="hover:text-black transition">الأسئلة الشائعة</a>
          <a href="https://wa.me/201055835754" className="text-green-600 text-lg hover:scale-110 transition"><i className="fab fa-whatsapp"></i></a>
        </div>
      </nav>

      <section className="hero-section h-[40vh] flex flex-col items-center justify-center text-center px-6 text-black">
        <h2 className="text-5xl md:text-6xl serif italic mb-2 drop-shadow-sm">Flowering Your Life</h2>
        <p className="tracking-[0.3em] uppercase text-[10px] font-bold opacity-80">Premium Dutch Roses</p>
      </section>

      <section id="products" className="py-16 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div className="group cursor-pointer" onClick={() => openModal("The Grand 100", 5500)}>
          <div className="overflow-hidden rounded-2xl shadow-lg mb-6">
            <img src={config.img100} className="w-full h-[500px] object-cover group-hover:scale-105 transition duration-700" alt="The Grand 100" />
          </div>
          <div className="flex justify-between items-center px-2 serif italic text-2xl">
            <span>The Grand 100</span>
            <span className="font-sans text-xl not-italic font-bold">5,500 EGP</span>
          </div>
        </div>
        
        <div className="group cursor-pointer" onClick={() => openModal("The Classic 50", 2750)}>
          <div className="overflow-hidden rounded-2xl shadow-lg mb-6">
            <img src={config.img50} className="w-full h-[500px] object-cover group-hover:scale-105 transition duration-700" alt="The Classic 50" />
          </div>
          <div className="flex justify-between items-center px-2 serif italic text-2xl">
            <span>The Classic 50</span>
            <span className="font-sans text-xl not-italic font-bold">2,750 EGP</span>
          </div>
        </div>
      </section>

      <section id="faq" className="py-16 mx-auto px-6 max-w-4xl text-right">
        <h2 className="text-3xl font-bold mb-10 text-center serif italic border-b pb-4">الأسئلة الشائعة (FAQ)</h2>
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-lg font-bold mb-2 text-black"><i className="fas fa-leaf text-green-500 ml-2"></i>ما هي جودة الورد المستخدم في الباقات؟</h3>
            <p className="text-gray-600 text-sm leading-relaxed">نستخدم فقط الورد الهولندي الفاخر عالي الجودة (Premium Dutch Roses)، المستورد خصيصاً ليضمن لك عمراً أطول وشكلاً أكثر فخامة.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-lg font-bold mb-2 text-black"><i className="fas fa-credit-card text-blue-500 ml-2"></i>ما هي طرق الدفع المتاحة لـ OPay؟</h3>
            <p className="text-gray-600 text-sm leading-relaxed">نوفر الدفع الآمن والموثوق 100% عبر بوابة OPay، والتي تتيح الدفع بالبطاقات البنكية (فيزا / ماستركارد)، المحافظ الإلكترونية، بسهولة تامة.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
            <h3 className="text-lg font-bold mb-2 text-black"><i className="fas fa-map-marker-alt text-red-500 ml-2"></i>كيف تعمل ميزة تحديد الموقع (Location)؟</h3>
            <p className="text-gray-600 text-sm leading-relaxed">عند استخراج إحداثيات موقعك الجغرافي (بشكل آمن تماماً) يُنشئ النظام رابط Google Maps ليتصل المندوب بك بسرعة ودقة.</p>
          </div>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white max-w-lg w-full p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] text-right">
            <h3 className="text-2xl serif italic mb-6 border-b pb-4">تخصيص {selectedProduct}</h3>
            <form onSubmit={handleOrder} className="space-y-4 text-right">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">لون الورد</label>
                  <select value={formData.roseColor} onChange={e => setFormData({ ...formData, roseColor: e.target.value })} className="w-full p-4 border rounded-xl bg-gray-50 text-sm outline-none">
                    {config.roseColors.map((color: string, i: number) => <option key={i} value={color}>{color}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">لون اللفّة</label>
                  <select value={formData.wrapColor} onChange={e => setFormData({ ...formData, wrapColor: e.target.value })} className="w-full p-4 border rounded-xl bg-gray-50 text-sm outline-none">
                    {config.wrapColors.map((color: string, i: number) => <option key={i} value={color}>{color}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">تاريخ التوصيل</label>
                  <input type="date" required value={formData.deliveryDate} onChange={e => setFormData({ ...formData, deliveryDate: e.target.value })} className="w-full p-4 border rounded-xl text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 mb-1">وقت التوصيل</label>
                  <input type="time" required value={formData.deliveryTime} onChange={e => setFormData({ ...formData, deliveryTime: e.target.value })} className="w-full p-4 border rounded-xl text-sm outline-none" />
                </div>
              </div>

              <input type="text" placeholder="الاسم بالكامل" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 border rounded-xl text-sm" />
              <input type="tel" placeholder="رقم الموبايل (Whatsapp)" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="w-full p-4 border rounded-xl text-sm" />

              <div className="space-y-2 text-right">
                <textarea placeholder="عنوان التوصيل (المنطقة، الشارع، علامة مميزة)" required value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} className="w-full p-4 border rounded-xl text-sm h-20 outline-none"></textarea>
                
                <button type="button" onClick={handleLocation} className="text-[10px] text-purple-700 font-bold underline bg-purple-50 px-3 py-2 rounded-lg">
                  <i className="fas fa-location-arrow ml-1"></i> استخراج إحداثيات موقعي الحالي
                </button>
                {formData.location && <p className="text-[10px] text-green-600 font-bold mt-1">✓ تم التقاط موقعك الجغرافي بنجاح</p>}
              </div>

              <textarea placeholder="رسالة الكارت (اختياري/إذا كان هدية)" value={formData.cardMessage} onChange={e => setFormData({ ...formData, cardMessage: e.target.value })} className="w-full p-4 border rounded-xl text-sm h-16 outline-none"></textarea>

              <button disabled={loading} type="submit" className="w-full py-5 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-gray-900 transition flex justify-center items-center gap-2">
                {loading ? 'جاري التحضير...' : <><i className="fas fa-lock text-sm"></i> تأكيد وتوجيه للدفع ({amount} EGP)</>}
              </button>
              
              <button type="button" onClick={() => setModalOpen(false)} className="w-full text-xs text-gray-400 mt-2 hover:text-black">إلغاء وإغلاق</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
