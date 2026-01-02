import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Building, MapPin, Package, Phone, Search, ShieldCheck, User, XCircle } from 'lucide-react';
import { useState } from 'react';
import { warrantyApi } from '../api';
import Navbar from '../components/Navbar';
import WarrantyInfoBlock from '../components/Warranty/WarrantyInfoBlock';
import WarrantyStatusBadge from '../components/Warranty/WarrantyStatusBadge';

const Home = () => {
  const [customerType, setCustomerType] = useState('retail'); // 'retail' (SĐT) or 'business' (MST)
  const [formData, setFormData] = useState({
    serialNumber: '',
    taxCode: '',
    customerPhone: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const payload = {
        serialNumber: formData.serialNumber,
        // Gửi đúng trường dựa trên loại khách hàng đã chọn
        [customerType === 'business' ? 'taxCode' : 'customerPhone']: 
          customerType === 'business' ? formData.taxCode : formData.customerPhone
      };
      const response = await warrantyApi.search(payload);
      setResult(response.data);
    } catch (err) {
      // Ưu tiên hiển thị thông báo trả về từ Server nếu có
      const serverMessage = err.response?.data?.message;
      if (serverMessage === 'No warranty record found') {
        setError('Thông tin bảo hành không tồn tại trong hệ thống. Vui lòng kiểm tra lại Serial hoặc SĐT/MST.');
      } else {
        setError(serverMessage || 'Có lỗi xảy ra khi kết nối tới máy chủ. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = (product) => {
    setResult(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20 pt-24 relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary-50/50 to-transparent -z-10 blur-3xl opacity-50"></div>
      
      {/* Reusable Navbar */}
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 space-y-12">
      <div className="text-center space-y-4 relative">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight"
        >
          Tra Cứu <span className="gradient-text">Bảo Hành</span>
        </motion.h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Hệ thống kiểm tra thời hạn bảo hành chính hãng dành cho khách hàng của SMARTRETAIL.
        </p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 md:p-8"
      >
        {/* Hướng dẫn tra cứu */}
        <div className="flex items-center gap-2 mb-8 text-primary-600 font-bold border-b border-slate-100 pb-4">
          <Package size={18} /> Tra cứu theo số Serial
        </div>

        {/* Chọn loại khách hàng */}
        <div className="flex gap-3 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            type="button"
            onClick={() => setCustomerType('retail')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${customerType === 'retail' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <User size={16} /> Khách cá nhân
          </button>
          <button 
            type="button"
            onClick={() => setCustomerType('business')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${customerType === 'business' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Briefcase size={16} /> Doanh nghiệp (MST)
          </button>
        </div>

        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Số Serial (S/N)</label>
            <div className="relative group">
              <Package className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              <input
                type="text"
                required
                placeholder="Nhập số serial sản phẩm..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all bg-slate-50/30 text-slate-800 font-medium placeholder:text-slate-400"
                value={formData.serialNumber}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">
              {customerType === 'business' ? 'Mã số thuế (MST)' : 'Số điện thoại khách hàng'}
            </label>
            <div className="relative group">
              {customerType === 'business' ? (
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              ) : (
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
              )}
              <input
                type="text"
                required
                placeholder={customerType === 'business' ? "Nhập mã số thuế công ty..." : "Nhập số điện thoại đăng ký..."}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all bg-slate-50/30 text-slate-800 font-medium placeholder:text-slate-400"
                value={customerType === 'business' ? formData.taxCode : formData.customerPhone}
                onChange={(e) => {
                  if (customerType === 'business') {
                    setFormData({...formData, taxCode: e.target.value});
                  } else {
                    setFormData({...formData, customerPhone: e.target.value});
                  }
                }}
              />
            </div>
          </div>

          <div className="md:col-span-2 flex justify-center pt-8">
            <button
              disabled={loading}
              className="bg-[#0086D1] hover:bg-[#0075b5] text-white font-black py-4 px-8 md:px-12 rounded-2xl shadow-xl shadow-blue-500/30 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95 group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <div className="relative flex items-center gap-3">
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Search size={22} className="stroke-[3]" />
                )}
                <span className="tracking-tight uppercase">KIỂM TRA NGAY</span>
              </div>
            </button>
          </div>
        </form>

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 border border-rose-100 shadow-sm"
          >
            <XCircle size={20} /> <span className="font-semibold">{error}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Kết quả chi tiết */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card overflow-hidden border-t-4 border-t-primary-500"
          >
            <div className="p-6 md:p-8 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{result.productName}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold font-mono tracking-wider uppercase border border-slate-200">
                      MOD: {result.productCode}
                    </span>
                  </div>
                </div>
                <WarrantyStatusBadge status={result.status} />
              </div>

              <WarrantyInfoBlock warranty={result} />
  
                <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
                    <Building size={16} className="text-primary-500" /> Thông tin sở hữu
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chủ sở hữu</p>
                      <p className="font-bold text-slate-700">{result.companyName || 'Khách hàng cá nhân'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mã số thuế</p>
                      <p className="font-bold text-slate-700">{result.taxCode || '—'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Số điện thoại</p>
                      <p className="font-bold text-slate-700">{result.customerPhone}</p>
                    </div>
                    {result.deliveryAddress && (
                      <div className="md:col-span-2 lg:col-span-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Địa chỉ giao hàng</p>
                        <p className="font-bold text-slate-700 text-xs leading-relaxed flex items-start gap-1.5 mt-1">
                          <MapPin size={12} className="text-primary-400 shrink-0 mt-0.5" />
                          {result.deliveryAddress}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Phần mềm được tích hợp (v2.1) */}
                {result.hasSoftware && (
                  <div className="mt-8 space-y-4">
                    <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2 px-2">
                       <ShieldCheck size={16} className="text-emerald-500" /> Thông tin Phần mềm Bản quyền
                    </h3>
                    
                    {result.isMaster ? (
                      <SoftwareInfoCard 
                        softwareInfo={result.softwareInfo} 
                        softwareStatus={result.softwareStatus} 
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                      />
                    ) : (
                      <SoftwareMemberAlert masterSerial={result.softwareInfo?.masterSerial} />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
  
        {/* Nút Danh sách nhiều sản phẩm đã bị loại bỏ theo yêu cầu */}
      </div>
    </div>
  );
};

export default Home;
