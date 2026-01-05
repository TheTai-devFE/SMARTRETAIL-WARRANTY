import { AnimatePresence, motion } from 'framer-motion';
import { Building, ChevronRight, Phone, Search, User, XCircle } from 'lucide-react';
import { useState } from 'react';
import { searchApi } from '../api';
import Navbar from '../components/Navbar';
import SoftwareInfoBlock from '../components/Software/SoftwareInfoBlock';
import WarrantyInfoBlock from '../components/Warranty/WarrantyInfoBlock';
import WarrantyStatusBadge from '../components/Warranty/WarrantyStatusBadge';

const Home = () => {
  const [formData, setFormData] = useState({
    taxCode: '',
    customerPhone: '',
    customerCode: '',
    searchType: 'business', // 'business' or 'personal'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null); // Can be object (single) or array (list)
  const [error, setError] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null); // For handling array selection

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setSelectedProduct(null);

    try {
      const payload = {
        customerCode: formData.customerCode,
      };

      if (formData.searchType === 'business') {
        payload.taxCode = formData.taxCode; // MKH + MST
      } else {
        payload.customerPhone = formData.customerPhone; // MKH + SĐT
      }

      const response = await searchApi.searchProducts(payload);
      setResult(response.data.products);
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      if (serverMessage === 'Không tìm thấy sản phẩm' || serverMessage === 'No products found') {
        setError('Không tìm thấy thông tin phù hợp trong hệ thống. Vui lòng kiểm tra lại Mã KH và MST/SĐT.');
      } else {
        setError(serverMessage || 'Có lỗi xảy ra khi kết nối tới máy chủ.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderProductDetail = (product) => {
    const isSoftware = product.type === 'Software' || (!product.productCode && product.licenseType);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card overflow-hidden border-t-4 border-t-primary-500"
      >
        <div className="p-6 md:p-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">
                {product.productName}
              </h2>
              {product.productCode && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-bold font-mono tracking-wider uppercase border border-slate-200">
                    MOD: {product.productCode}
                  </span>
                </div>
              )}
            </div>
            {/* Status Badge - Adapt for Software */}
            {isSoftware ? (
              <div className={`px-4 py-2 rounded-xl text-sm font-black uppercase tracking-wider ${product.licenseStatus === 'Activated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                {product.licenseStatus === 'Activated' ? 'Đã kích hoạt' : 'Chờ kích hoạt'}
              </div>
            ) : (
              <WarrantyStatusBadge status={product.status} />
            )}
          </div>

          {isSoftware ? (
            <SoftwareInfoBlock software={product} />
          ) : (
            <WarrantyInfoBlock warranty={product} />
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pb-20 pt-24 mt-16 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary-50/50 to-transparent -z-10 blur-3xl opacity-50"></div>

      <Navbar />

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4 relative">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
          >
            TRA CỨU <span className="gradient-text">BẢO HÀNH</span>
          </motion.h1>
          <p className="text-slate-500 max-w-lg text-lg mx-auto">
            Tra cứu thông tin bảo hành Phần cứng & Phần mềm
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 md:p-8"
        >
          <div className="flex items-center gap-2 mb-8 text-primary-600 font-bold border-b border-slate-100 pb-4">
            <Search size={18} /> Nhập thông tin khách hàng
          </div>

          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <label className="text-sm font-bold text-slate-700">Loại khách hàng:</label>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, searchType: 'business' })}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${formData.searchType === 'business' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'
                      }`}
                  >
                    <Building size={14} className="inline mr-1" />
                    Doanh nghiệp (MST)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, searchType: 'personal' })}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${formData.searchType === 'personal' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'
                      }`}
                  >
                    <User size={14} className="inline mr-1" />
                    Cá nhân (SĐT)
                  </button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Mã Khách Hàng *</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input type="text" required placeholder="Nhập mã khách hàng..." className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all bg-slate-50/30 text-slate-800 font-bold"
                  value={formData.customerCode} onChange={(e) => setFormData({ ...formData, customerCode: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">
                {formData.searchType === 'business' ? 'Mã số thuế *' : 'Số điện thoại *'}
              </label>
              <div className="relative group">
                {formData.searchType === 'business' ? (
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                ) : (
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                )}
                <input
                  type={formData.searchType === 'business' ? 'text' : 'tel'}
                  required
                  placeholder={formData.searchType === 'business' ? 'Nhập mã số thuế...' : 'Nhập số điện thoại...'}
                  pattern={formData.searchType === 'personal' ? '[0-9]{10}' : undefined}
                  maxLength={formData.searchType === 'personal' ? '10' : undefined}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all bg-slate-50/30 text-slate-800 font-bold"
                  value={formData.searchType === 'business' ? formData.taxCode : formData.customerPhone}
                  onChange={(e) => {
                    if (formData.searchType === 'business') {
                      setFormData({ ...formData, taxCode: e.target.value });
                    } else {
                      setFormData({ ...formData, customerPhone: e.target.value.replace(/\D/g, '') });
                    }
                  }}
                />
              </div>
            </div>

            <div className="md:col-span-2 flex justify-center pt-8">
              <button disabled={loading} className="bg-[#0086D1] hover:bg-[#0075b5] text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-blue-500/30 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95 group overflow-hidden relative">
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative flex items-center gap-3">
                  {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Search size={22} className="stroke-[3]" />}
                  <span className="tracking-tight uppercase">KIỂM TRA NGAY</span>
                </div>
              </button>
            </div>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 border border-rose-100 shadow-sm">
              <XCircle size={20} /> <span className="font-semibold">{error}</span>
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence>
          {result && (
            <div className="space-y-6">
              {/* Check if result is array with length > 0 */}
              {Array.isArray(result) ? (
                <>
                  <h2 className="text-xl font-black text-slate-700 px-2 border-l-4 border-primary-500">
                    {selectedProduct ? 'Chi tiết sản phẩm' : `Tìm thấy ${result.length} sản phẩm`}
                  </h2>

                  {!selectedProduct ? (
                    <div className="grid grid-cols-1 gap-4">
                      {result.map((item, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          onClick={() => setSelectedProduct(item)}
                          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-primary-200 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary-600 transition-colors">
                                {item.productName}
                              </h3>
                              <div className="flex items-center gap-3 mt-2 text-sm text-slate-500">
                                <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-mono font-bold">
                                  {item.type === 'Software' ? item.licenseType : (Array.isArray(item.serialNumber) ? item.serialNumber[0] : item.serialNumber)}
                                </span>
                                <span>•</span>
                                <span>{item.type === 'Software' ? 'Phần mềm' : 'Thiết bị'}</span>
                              </div>
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <button onClick={() => setSelectedProduct(null)} className="text-sm font-bold text-slate-500 hover:text-primary-600 flex items-center gap-1 transition-colors">
                        ← Quay lại danh sách
                      </button>
                      {renderProductDetail(selectedProduct)}
                    </div>
                  )}
                </>
              ) : (
                // Single Result (Legacy)
                renderProductDetail(result)
              )}
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Home;
