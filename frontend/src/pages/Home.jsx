import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Briefcase, Building, Calendar, CheckCircle2, Package, Phone, Search, User, XCircle } from 'lucide-react';
import { useState } from 'react';
import { warrantyApi } from '../api';

const Home = () => {
  const [searchType, setSearchType] = useState('single'); // 'single' or 'list'
  const [customerType, setCustomerType] = useState('retail'); // 'retail' (SĐT) or 'business' (MST)
  const [formData, setFormData] = useState({
    serialNumber: '',
    taxCode: '',
    customerPhone: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [multiResults, setMultiResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setMultiResults([]);

    try {
      if (searchType === 'single') {
        const payload = {
          serialNumber: formData.serialNumber,
          // Gửi đúng trường dựa trên loại khách hàng đã chọn
          [customerType === 'business' ? 'taxCode' : 'customerPhone']: 
            customerType === 'business' ? formData.taxCode : formData.customerPhone
        };
        const response = await warrantyApi.search(payload);
        setResult(response.data);
      } else {
        let response;
        if (customerType === 'business' && formData.taxCode) {
          response = await warrantyApi.getByTax(formData.taxCode);
        } else if (customerType === 'retail' && formData.customerPhone) {
          response = await warrantyApi.getByPhone(formData.customerPhone);
        } else {
          throw new Error(`Vui lòng nhập ${customerType === 'business' ? 'Mã số thuế' : 'Số điện thoại'}`);
        }
        setMultiResults(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Không tìm thấy dữ liệu bảo hành');
    } finally {
      setLoading(false);
    }
  };

  const selectProduct = (product) => {
    setResult(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pb-20">
      {/* User Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 mb-12">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 font-black text-2xl tracking-tighter text-slate-900">
            <span className="bg-primary-600 text-white px-2 py-0.5 rounded-lg">S</span>
            SMARTRETAIL
          </div>
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest hidden md:block">
            Hệ thống bảo hành điện tử
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 space-y-8">
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
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
        {/* Tab tra cứu */}
        <div className="flex gap-6 mb-8 border-b border-slate-100 pb-4">
          <button 
            onClick={() => { setSearchType('single'); setResult(null); }}
            className={`pb-2 transition-all flex items-center gap-2 ${searchType === 'single' ? 'text-primary-600 border-b-2 border-primary-600 font-bold' : 'text-slate-400 font-medium hover:text-slate-600'}`}
          >
            <Package size={18} /> Theo Serial
          </button>
          <button 
            onClick={() => { setSearchType('list'); setResult(null); }}
            className={`pb-2 transition-all flex items-center gap-2 ${searchType === 'list' ? 'text-primary-600 border-b-2 border-primary-600 font-bold' : 'text-slate-400 font-medium hover:text-slate-600'}`}
          >
            <Search size={18} /> Tất cả sản phẩm
          </button>
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
          {searchType === 'single' && (
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Số Serial (S/N)</label>
              <div className="relative group">
                <Package className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Nhập số serial sản phẩm..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all bg-slate-50/50"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">
              {customerType === 'business' ? 'Mã số thuế (MST)' : 'Số điện thoại khách hàng'}
            </label>
            <div className="relative group">
              {customerType === 'business' ? (
                <Building className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
              ) : (
                <Phone className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={18} />
              )}
              <input
                type="text"
                required
                placeholder={customerType === 'business' ? "Nhập mã số thuế công ty..." : "Nhập số điện thoại đăng ký..."}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all bg-slate-50/50"
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

          <div className="md:col-span-2 flex justify-center pt-4">
            <button
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-700 text-white font-black py-4 px-10 rounded-2xl shadow-xl shadow-primary-500/25 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Search size={20} className="stroke-[3]" />
              )}
              KIỂM TRA NGAY
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
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight">{result.productName}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold font-mono tracking-wider uppercase border border-slate-200">
                      MOD: {result.productCode}
                    </span>
                  </div>
                </div>
                <div className={`px-6 py-3 rounded-2xl font-black flex items-center gap-3 text-sm shadow-sm ${result.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  {result.status === 'Active' ? <CheckCircle2 size={20} className="stroke-[3]" /> : <XCircle size={20} className="stroke-[3]" />}
                  <span className="uppercase tracking-widest">{result.status === 'Active' ? 'Đang Bảo Hành' : 'Hết Hạn Bảo Hành'}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-8 border-y border-slate-100">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                      <Package size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Số Serial Sản Phẩm</p>
                      <p className="font-bold text-xl text-slate-800 font-mono">{result.serialNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày Bắt Đầu Bảo Hành</p>
                      <p className="font-bold text-xl text-slate-800">{format(new Date(result.startDate), 'dd/MM/yyyy')}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ngày Kết Thúc Bảo Hành</p>
                      <p className="font-bold text-xl text-slate-800">{format(new Date(result.endDate), 'dd/MM/yyyy')}</p>
                    </div>
                  </div>
                  {result.status === 'Active' && (
                    <motion.div 
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="bg-primary-600 p-5 rounded-2xl shadow-lg shadow-primary-500/20 text-white relative overflow-hidden"
                    >
                      <div className="relative z-10">
                        <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Số Ngày Còn Lại</p>
                        <p className="text-4xl font-black">{result.remainingDays} <span className="text-sm font-bold opacity-80 uppercase">ngày</span></p>
                      </div>
                      <Package className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12" size={100} />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Building size={16} className="text-primary-500" /> Thông tin sở hữu
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Danh sách nhiều sản phẩm */}
      {multiResults.length > 0 && !result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Sản phẩm của bạn ({multiResults.length})</h2>
            <div className="h-px bg-slate-200 flex-1 mx-4"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {multiResults.map((item) => (
              <button
                key={item._id}
                onClick={() => selectProduct(item)}
                className="group glass-card p-5 text-left border-l-4 border-l-transparent hover:border-l-primary-500 transition-all hover:translate-y-[-2px]"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold group-hover:text-primary-600 transition-colors line-clamp-1">{item.productName}</h4>
                  <span className={`text-[9px] uppercase font-black px-2 py-1 rounded-md tracking-widest shadow-sm ${item.status === 'Active' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                    {item.status === 'Active' ? 'Còn hạn' : 'Hết hạn'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">S/N: {item.serialNumber}</p>
                  <p className="text-xs text-slate-500">Hết hạn: {format(new Date(item.endDate), 'dd/MM/yyyy')}</p>
                </div>
                <div className="mt-4 flex justify-end">
                  <span className="text-xs font-black text-primary-600 group-hover:gap-2 transition-all flex items-center gap-1 uppercase tracking-widest">
                    Chi tiết <Search size={12} strokeWidth={3} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      )}
      </div>
    </div>
  );
};

export default Home;
