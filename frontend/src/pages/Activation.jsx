import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, CheckCircle, ChevronRight, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { warrantyApi } from '../api';
import SoftwareInfoCard from '../components/Software/SoftwareInfoCard';
import SoftwareMemberAlert from '../components/Software/SoftwareMemberAlert';
import WarrantyInfoBlock from '../components/Warranty/WarrantyInfoBlock';
import WarrantyStatusBadge from '../components/Warranty/WarrantyStatusBadge';

const Activation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warranty, setWarranty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchWarranty = async () => {
      try {
        setLoading(true);
        const res = await warrantyApi.check(id);
        setWarranty(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Không tìm thấy thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchWarranty();
  }, [id]);

  const handleActivate = async () => {
    try {
      setActivating(true);
      const res = await warrantyApi.activate(id);
      setWarranty(res.data);
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Kích hoạt thất bại');
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full glass-card p-8 text-center">
          <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Lỗi Truy Cập</h2>
          <p className="text-slate-500 mb-8">{error}</p>
          <button onClick={() => navigate('/')} className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl">Về Trang Chủ</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 font-black text-2xl tracking-tighter mb-4 text-slate-900">
            <span className="bg-primary-500 text-white px-2 py-0.5 rounded-lg">S</span>
            SMARTRETAIL
          </div>
          <h1 className="text-3xl font-black text-slate-900">Kích Hoạt Bảo Hành</h1>
          <p className="text-slate-500 mt-2">Xác nhận thông tin để bắt đầu thời gian bảo hành cho thiết bị của bạn.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card shadow-2xl shadow-primary-900/5 border border-white relative overflow-hidden"
        >
          {/* Header Highlight */}
          <div className={`h-2 w-full absolute top-0 left-0 ${warranty.status === 'Activated' ? 'bg-emerald-500' : 'bg-primary-500'}`}></div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-600 bg-primary-50 px-2 py-1 rounded">Sản phẩm chính hãng</span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">{warranty.productName}</h2>
                <p className="text-slate-500 font-mono text-sm">Model: {warranty.productCode}</p>
              </div>
              <WarrantyStatusBadge status={warranty.status} />
            </div>

            <WarrantyInfoBlock warranty={warranty} />

            {/* Thông tin Phần mềm (v2.1) */}
            {warranty.hasSoftware && (
              <div className="mt-8 mb-8 space-y-4">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2 px-2">
                   <ShieldCheck size={16} className="text-emerald-500" /> Bản quyền Phần mềm tích hợp
                </h3>
                
                {warranty.isMaster ? (
                  <SoftwareInfoCard
                    softwareInfo={warranty.softwareInfo} 
                    softwareStatus={warranty.softwareStatus} 
                  />
                ) : (
                  <SoftwareMemberAlert masterSerial={warranty.softwareInfo?.masterSerial} />
                )}
              </div>
            )}

            {warranty.status === 'Activated' ? (
              <div className="space-y-6">
                <div className="bg-emerald-50 border-2 border-emerald-100 rounded-3xl md:rounded-[32px] p-6 md:p-8 relative overflow-hidden">
                  {/* Decorative background circle */}
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-emerald-200/20 rounded-full blur-2xl"></div>
                   
                  <div className="flex flex-col gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl shadow-sm border border-emerald-100 flex items-center justify-center text-emerald-600">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Trạng thái hệ thống</p>
                        <h4 className="text-base md:text-lg font-black text-slate-900 tracking-tight">Kích hoạt thành công</h4>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 md:gap-8 pt-6 border-t border-emerald-100/50">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày kích hoạt</p>
                        <p className="font-extrabold text-xs md:text-base text-slate-700">{format(new Date(warranty.activationDate), 'dd/MM/yyyy')}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ngày hết hạn</p>
                        <p className="font-extrabold text-xs md:text-base text-emerald-600">{format(new Date(warranty.endDate), 'dd/MM/yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/')}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-slate-900/10 group"
                >
                  Đã hoàn tất - Quay lại <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                  <AlertCircle className="text-blue-500 shrink-0" size={20} />
                  <p className="text-xs text-blue-700 leading-relaxed font-medium">
                    Nhấn nút <b>"Kích hoạt bảo hành"</b> bên dưới để bắt đầu tính thời hạn bảo hành cho (các) thiết bị này. Sau khi kích hoạt, bạn không thể thay đổi ngày bắt đầu.
                  </p>
                </div>
                <button 
                  onClick={handleActivate}
                  disabled={activating}
                  className={`w-full ${activating ? 'bg-slate-300' : 'bg-primary-600 hover:bg-primary-700'} text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-primary-500/20 text-lg flex items-center justify-center gap-3`}
                >
                  {activating ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      Kích Hoạt Bảo Hành Ngay <ShieldCheck size={22} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {success && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 bg-emerald-500 text-white p-6 rounded-3xl shadow-xl flex items-center gap-4"
            >
              <div className="bg-white/20 p-3 rounded-2xl">
                <CheckCircle size={32} />
              </div>
              <div>
                <h4 className="font-black text-xl">Kích hoạt thành công!</h4>
                <p className="text-emerald-50 font-medium">Bảo hành điện của bạn đã chính thức bắt đầu.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Activation;
