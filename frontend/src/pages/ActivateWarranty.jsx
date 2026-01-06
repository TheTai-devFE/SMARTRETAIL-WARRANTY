import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Building, CheckCircle2, Info, Package, Phone, ShieldCheck, User, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { warrantyApi } from '../api';
import Navbar from '../components/Navbar';

const ActivateWarranty = () => {
  const { serial } = useParams();
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [warranty, setWarranty] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customerPhone: '',
    companyName: '',
    taxCode: ''
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        setLoading(true);
        const res = await warrantyApi.check(serial);
        setWarranty(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Không tìm thấy thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    if (serial) fetchInfo();
  }, [serial]);

  const handleActivate = async (e) => {
    e.preventDefault();
    if (!formData.customerPhone) {
      alert('Vui lòng nhập số điện thoại để kích hoạt');
      return;
    }
    try {
      setActivating(true);
      const res = await warrantyApi.activate(serial, formData);
      setWarranty(res.data.warranty);
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi kích hoạt');
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-20 bg-slate-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 mt-12 space-y-8">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block p-4 bg-primary-50 rounded-3xl text-primary-600 mb-2"
          >
            <ShieldCheck size={48} className="stroke-[1.5]" />
          </motion.div>
          <h1 className="text-4xl font-black tracking-tighter text-slate-900">
            Kích Hoạt <span className="text-primary-600">Bảo Hành</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Sản phẩm chính hãng của SMARTRETAIL
          </p>
        </div>

        {error ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="glass-card p-12 text-center space-y-4 border-rose-100"
          >
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <XCircle size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{error}</h2>
            <p className="text-slate-500">Vui lòng kiểm tra lại mã QR hoặc liên hệ bộ phận hỗ trợ.</p>
            <a href="/" className="inline-block pt-4 text-primary-600 font-bold hover:underline">Về trang chủ</a>
          </motion.div>
        ) : success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-8 md:p-12 text-center space-y-6 border-emerald-100"
          >
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={40} className="stroke-[3]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Kích Hoạt Thành Công!</h2>
              <p className="text-slate-500 font-medium">Bảo hành điện tử đã được thiết lập cho thiết bị của bạn.</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-4 border border-slate-100">
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sản phẩm</span>
                <span className="font-bold text-slate-800">{warranty.productName}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200/60 pb-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Số Serial</span>
                <span className="font-bold text-slate-800 font-mono italic">{warranty.serialNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ngày hết hạn</span>
                <span className="font-bold text-primary-600">{format(new Date(warranty.expiredAt), 'dd/MM/yyyy')}</span>
              </div>
            </div>

            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl shadow-xl hover:bg-slate-800 transition-all uppercase tracking-widest text-sm"
            >
              Hoàn tất
            </button>
          </motion.div>
        ) : (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 border-primary-100 bg-primary-50/30"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-primary-600">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="font-black text-slate-800">{warranty.productName}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Model: {warranty.productCode}</p>
                  <p className="text-sm font-bold text-primary-600 mt-2 font-mono italic">S/N: {warranty.serialNumber}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="glass-card p-8 space-y-8"
            >
              <div className="space-y-2">
                <h3 className="text-xl font-black text-slate-800">Thông tin kích hoạt</h3>
                <p className="text-sm text-slate-500 font-medium">Vui lòng điền thông tin để chúng tôi phục vụ bạn tốt hơn khi cần bảo hành.</p>
              </div>

              <form onSubmit={handleActivate} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Số điện thoại liên hệ *</label>
                    <div className="relative group">
                      <Phone className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                      <input
                        required
                        type="tel"
                        placeholder="Nhập số điện thoại của bạn..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all bg-slate-50/50 font-semibold"
                        value={formData.customerPhone}
                        onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tên khách hàng / Đơn vị</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                      <input
                        type="text"
                        placeholder="Tên cá nhân hoặc công ty sở hữu..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all bg-slate-50/50 font-semibold"
                        value={formData.companyName}
                        onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                      />
                    </div>
                  </div>

                  {formData.companyName && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mã số thuế (nếu có)</label>
                      <div className="relative group">
                        <Building className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                        <input
                          type="text"
                          placeholder="Nhập mã số thuế doanh nghiệp..."
                          className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all bg-slate-50/50 font-semibold"
                          value={formData.taxCode}
                          onChange={e => setFormData({ ...formData, taxCode: e.target.value })}
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl flex items-start gap-3 border border-slate-100">
                  <Info size={18} className="text-primary-500 mt-0.5" />
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Bằng việc nhấn kích hoạt, bạn đồng ý với <Link to="/chinh-sach" className="text-primary-600 font-bold hover:underline">Chính sách bảo hành</Link> của SmartRetail. Thời hạn {warranty.warrantyDuration} tháng sẽ được tính từ ngày hôm nay.
                  </p>
                </div>

                <button
                  disabled={activating}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-primary-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98]"
                >
                  {activating ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <ShieldCheck size={20} className="stroke-[3]" />
                      KÍCH HOẠT BẢO HÀNH NGAY
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivateWarranty;
