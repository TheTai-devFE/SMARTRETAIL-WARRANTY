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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans flex flex-col">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary-50/50 via-accent-50/30 to-transparent -z-10 blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-l from-accent-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation"></div>
      <div className="absolute bottom-40 left-0 w-96 h-96 bg-gradient-to-r from-primary-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation" style={{ animationDelay: '1s' }}></div>

      <Navbar />

      <div className="flex-1 flex items-center justify-center py-20 px-4 md:py-24">
        <div className="w-full max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card overflow-hidden"
          >
            <div className="p-6 md:p-10 lg:p-12">
              {/* Header Section - Compact */}
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8 border-b border-slate-100 pb-8">
                <div className="space-y-2 text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-primary-50 to-accent-50 rounded-full border border-primary-200/50">
                    <ShieldCheck size={14} className="text-primary-600" />
                    <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">Sản phẩm chính hãng</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                    {warranty.productName}
                  </h1>
                  <p className="text-sm md:text-base font-bold text-slate-400 font-mono uppercase">
                    Model: {warranty.productCode}
                  </p>
                </div>

                <div className={`shrink-0 flex items-center gap-3 px-6 py-4 rounded-2xl border-2 ${warranty.status === 'Activated'
                  ? 'bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-200 text-emerald-700'
                  : 'bg-gradient-to-br from-amber-50 to-amber-100/50 border-amber-200 text-amber-700'
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
                      <h3 className="font-black text-slate-800 text-xs uppercase tracking-wider">Bản quyền phần mềm</h3>
                    </div>

                    <SoftwareInfoCard
                      softwareInfo={warranty.softwareInfo}
                      softwareStatus={warranty.softwareStatus}
                    />
                  </div>
                )}

                {/* Action Section - Inline & Compact */}
                <div className="pt-8 border-t border-slate-100">
                  {warranty.status !== 'Activated' ? (
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200">
                      <div className="space-y-1">
                        <p className="font-black text-lg text-slate-900 tracking-tight">Xác nhận kích hoạt</p>
                        <p className="text-slate-500 text-xs md:text-sm font-medium leading-relaxed">
                          Nhấn nút để bắt đầu tính thời gian bảo hành chính hãng.
                        </p>
                      </div>
                      <button
                        onClick={handleActivate}
                        disabled={activating}
                        className="gradient-button w-full md:w-auto text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
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
            <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">SmartRetail Warranty Management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activation;
