"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/orders').then(r => r.json()),
      fetch('/api/settings').then(r => r.json())
    ]).then(([ordersData, configData]) => {
      setOrders(ordersData);
      setConfig(configData);
      setLoading(false);
    });
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config) return;
    
    try {
      JSON.parse(config.roseColors);
      JSON.parse(config.wrapColors);
    } catch {
      return alert('خطأ: تأكد أن الألوان مكتوبة على شكل مصفوفة JSON صحيحة مثل ["أحمر","أبيض"]');
    }
    
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          img100: config.img100,
          img50: config.img50,
          roseColors: config.roseColors,
          wrapColors: config.wrapColors
        })
      });
      alert('تم تحديث قواعد البيانات بنجاح! الموقع الخارجي سيقوم الآن بقراءة هذه الإعدادات الجديدة فوراً.');
    } catch {
      alert('فشل الاتصال بالسيرفر');
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-bold tracking-wider text-gray-500">جاري تحميل لوحة التحكم والاتصال بقاعدة البيانات...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-10">

        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-4"><i className="fas fa-cogs ml-2 text-blue-500"></i> إعدادات المنتجات وقاعدة بيانات الخيارات</h2>
          <form onSubmit={handleSaveSettings} className="space-y-6 text-sm">
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block font-bold text-gray-500 mb-2">رابط صورة باقة 100 وردة</label>
                <input type="url" value={config?.img100 || ''} onChange={e => setConfig({...config, img100: e.target.value})} className="w-full p-4 border rounded-xl bg-gray-50 outline-none text-left" dir="ltr" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-2">رابط صورة باقة 50 وردة</label>
                <input type="url" value={config?.img50 || ''} onChange={e => setConfig({...config, img50: e.target.value})} className="w-full p-4 border rounded-xl bg-gray-50 outline-none text-left" dir="ltr" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-4">
              <div>
                <label className="block font-bold text-gray-500 mb-2">خيارات "لون الورد" (بصيغة Array JSON)</label>
                <textarea rows={4} value={config?.roseColors || ''} onChange={e => setConfig({...config, roseColors: e.target.value})} className="w-full p-4 border rounded-xl bg-gray-50 outline-none text-left font-mono" dir="ltr" />
              </div>
              <div>
                <label className="block font-bold text-gray-500 mb-2">خيارات "لون اللفة" (بصيغة Array JSON)</label>
                <textarea rows={4} value={config?.wrapColors || ''} onChange={e => setConfig({...config, wrapColors: e.target.value})} className="w-full p-4 border rounded-xl bg-gray-50 outline-none text-left font-mono" dir="ltr" />
              </div>
            </div>

            <button type="submit" className="px-10 py-4 bg-black text-white rounded-xl text-xs font-bold uppercase hover:bg-gray-800 transition shadow-lg">حفظ ومزامنة مع الموقع الخارجي</button>
          </form>
        </section>

        <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4"><i className="fas fa-shopping-cart ml-2 text-green-500"></i> سجل الطلبات المباشر (Database Server)</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-right text-sm whitespace-nowrap">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-[10px]">
                        <tr>
                            <th className="p-4">رقم العملية</th>
                            <th className="p-4">التاريخ</th>
                            <th className="p-4">المنتج والمبلغ</th>
                            <th className="p-4">التوصيل (تاريخ/وقت)</th>
                            <th className="p-4">بيانات العميل</th>
                            <th className="p-4">العنوان والموقع</th>
                            <th className="p-4">التنسيق والرسالة</th>
                            <th className="p-4">حالة الدفع (OPay)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.length === 0 ? <tr><td colSpan={8} className="p-8 text-center text-gray-400">لا يوجد طلبات حتى الآن</td></tr> : null}
                      {orders.map(order => (
                        <tr key={order.id} className="hover:bg-blue-50/50 transition duration-200 align-top">
                          <td className="p-4 font-mono text-[10px] text-gray-400">{order.orderId}</td>
                          <td className="p-4 text-[11px] text-gray-500 font-bold">{new Date(order.date).toLocaleString('ar-EG')}</td>
                          <td className="p-4">
                            <div className="font-bold text-black">{order.productName}</div>
                            <div className="text-green-600 font-bold">{order.amount} EGP</div>
                          </td>
                          <td className="p-4 text-purple-700 font-bold text-xs bg-purple-50/30">
                            <div>{order.deliveryDate}</div>
                            <div>{order.deliveryTime}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold">{order.customerName}</div>
                            <div className="font-mono text-gray-400">{order.customerPhone}</div>
                          </td>
                          <td className="p-4 max-w-xs whitespace-normal line-clamp-2 leading-relaxed">
                            <div className="mb-2 text-xs text-gray-600">{order.deliveryAddress}</div>
                            {order.geoLocation !== 'غير متوفر' ? (
                               <a href={order.geoLocation} target="_blank" rel="noreferrer" className="text-blue-500 font-bold text-[10px] bg-blue-50 px-2 py-1 rounded inline-block">فتح في صور جوجل <i className="fas fa-location-arrow border-r pr-1 ml-1"></i></a>
                            ) : <span className="text-[10px] text-gray-300">بدون لوكيشن</span>}
                          </td>
                          <td className="p-4 text-xs text-gray-500">
                            <div className="mb-1"><span className="text-gray-400">ورد:</span> {order.roseColor}</div>
                            <div className="mb-1"><span className="text-gray-400">لفة:</span> {order.wrapColor}</div>
                            {order.cardMessage && order.cardMessage !== 'بدون رسالة' && (
                               <div className="p-2 bg-gray-50 border rounded mt-2 text-[10px] italic">"{order.cardMessage}"</div>
                            )}
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                </table>
            </div>
        </section>

      </div>
    </div>
  );
}
