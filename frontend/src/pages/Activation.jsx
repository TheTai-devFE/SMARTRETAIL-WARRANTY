import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { warrantyApi } from '../api';
import Navbar from '../components/Navbar';
import SoftwareInfoCard from '../components/Software/SoftwareInfoCard';
import WarrantyInfoBlock from '../components/Warranty/WarrantyInfoBlock';

const Activation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warranty, setWarranty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(false);

  useEffect(() => {
    const fetchWarranty = async () => {
      try {
        const response = await warrantyApi.getById(id);
        setWarranty(response.data);
      } catch (err) {
        toast.error('Không tìm thấy thông tin bảo hành');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchWarranty();
  }, [id, navigate]);

  const handleActivate = async () => {
    if (activating) return;
    setActivating(true);
    try {
      await warrantyApi.activate(id);
      toast.success('Kích hoạt bảo hành thành công!');
      const response = await warrantyApi.getById(id);
      setWarranty(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi kích hoạt');
    } finally {
      setActivating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!warranty) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] relative overflow-hidden font-sans flex flex-col">
      <Navbar />

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary-50/30 to-transparent -z-10"></div>

      <div className="flex-1 flex items-center justify-center py-20 px-4 md:py-24">
        <div className="w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] overflow-hidden border border-slate-100/50"
          >
            <div className="p-6 md:p-10 lg:p-12">
              {/* Header Section - Compact */}
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8 border-b border-slate-50 pb-8">
                <div className="space-y-2 text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-primary-50 rounded-full">
                    <ShieldCheck size={12} className="text-primary-600" />
                    <span className="text-[9px] font-black text-primary-600 uppercase tracking-[0.2em]">Sản phẩm chính hãng</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                    {warranty.productName}
                  </h1>
                  <p className="text-sm md:text-base font-bold text-slate-400 font-mono uppercase">
                    Model: {warranty.productCode}
                  </p>
                </div>

                <div className={`shrink-0 flex items-center gap-3 px-6 py-4 rounded-3xl border-2 ${warranty.status === 'Activated'
                  ? 'bg-emerald-50/50 border-emerald-100 text-emerald-600'
                  : 'bg-amber-50/50 border-amber-100 text-amber-600'
                  }`}>
                  <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${warranty.status === 'Activated' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></div>
                  <span className="text-xs md:text-sm font-black uppercase tracking-wider">
                    {warranty.status === 'Activated' ? 'Đang bảo hành' : 'Chờ kích hoạt'}
                  </span>
                </div>
              </div>

              {/* Main Content - Compact Spacing */}
              <div className="space-y-8">
                <WarrantyInfoBlock warranty={warranty} compact />

                {/* Software - Optional */}
                {/* UPDATED: Only show for Master. Child items (Project) will have isMaster=false and thus hide this block. */}
                {(warranty.hasSoftware && warranty.isMaster) && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-1">
                      <ShieldCheck size={18} className="text-emerald-500" />
                      <h3 className="font-black text-slate-800 text-xs uppercase tracking-[0.15em]">Bản quyền phần mềm</h3>
                    </div>

                    <SoftwareInfoCard
                      softwareInfo={warranty.softwareInfo}
                      softwareStatus={warranty.softwareStatus}
                    />
                  </div>
                )}

                {/* Action Section - Inline & Compact */}
                <div className="pt-8 border-t border-slate-50">
                  {warranty.status !== 'Activated' ? (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-slate-50/50 p-6 rounded-3xl border border-slate-100">
                      <div className="space-y-1">
                        <p className="font-black text-lg text-slate-900 tracking-tight">Xác nhận kích hoạt</p>
                        <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                          Nhấn nút để bắt đầu tính thời gian bảo hành chính hãng.
                        </p>
                      </div>
                      <button
                        onClick={handleActivate}
                        disabled={activating}
                        className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                      >
                        {activating ? (
                          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          'Kích hoạt ngay'
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <button
                        onClick={() => navigate('/')}
                        className="w-full md:w-auto md:min-w-[320px] bg-slate-900 hover:bg-slate-800 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-slate-900/10 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-sm uppercase tracking-widest group"
                      >
                        Hoàn tất - Quay lại
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="text-center mt-6">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">SmartRetail Warranty Management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activation;
