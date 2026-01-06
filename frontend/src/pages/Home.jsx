import { AnimatePresence, motion } from 'framer-motion';
import { Building, ChevronRight, Phone, Search, User, Wrench, XCircle } from 'lucide-react';
import { useState } from 'react';
import { repairApi, searchApi } from '../api';
import Navbar from '../components/Navbar';
import RepairInfoBlock from '../components/Repair/RepairInfoBlock';
import SoftwareInfoBlock from '../components/Software/SoftwareInfoBlock';
import WarrantyInfoBlock from '../components/Warranty/WarrantyInfoBlock';
import WarrantyStatusBadge from '../components/Warranty/WarrantyStatusBadge';

const Home = () => {
  const [formData, setFormData] = useState({
    taxCode: '',
    customerPhone: '',
    customerCode: '',
    searchType: 'business', // 'business', 'personal', 'repair'
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
      if (formData.searchType === 'repair') {
        // Repair Search
        const payload = {
          code: formData.customerCode,
          phoneNumber: formData.customerPhone
        };
        // Simple search returns Array
        const response = await repairApi.search(payload);
        setResult(response.data.map(item => ({ ...item, type: 'Repair' })));
      } else {
        // Warranty Search
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
      }
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      if (serverMessage === 'Không tìm thấy sản phẩm' || serverMessage === 'No products found' || serverMessage === 'Không tìm thấy yêu cầu') {
        setError('Không tìm thấy thông tin phù hợp trong hệ thống. Vui lòng kiểm tra lại thông tin.');
      } else {
        setError(serverMessage || 'Có lỗi xảy ra khi kết nối tới máy chủ.');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderProductDetail = (product) => {
    const isSoftware = product.type === 'Software' || (!product.productCode && product.licenseType);
    const isRepair = product.type === 'Repair';

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
            ) : isRepair ? null : (
              <WarrantyStatusBadge status={product.status} />
            )}
          </div>

          {isSoftware ? (
            <SoftwareInfoBlock software={product} />
          ) : isRepair ? (
            <RepairInfoBlock repair={product} />
          ) : (
            <WarrantyInfoBlock warranty={product} />
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pb-20 pt-24 mt-16 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary-50/50 via-accent-50/30 to-transparent -z-10 blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-l from-accent-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation"></div>
      <div className="absolute bottom-40 left-0 w-96 h-96 bg-gradient-to-r from-primary-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation" style={{ animationDelay: '1s' }}></div>

      <Navbar />

      <div className="max-w-4xl mx-auto px-4 space-y-12">
        {/* Hero Section - SEO Optimized */}
        <header className="text-center space-y-6 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 rounded-full border border-primary-200/50 mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
              </span>
              <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">Dịch vụ chuyên nghiệp</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight"
          >
            TRA CỨU <span className="gradient-text">BẢO HÀNH</span>
            <br />
            <span className="text-2xl md:text-4xl text-slate-600 font-semibold">& Dịch Vụ Sửa Chữa</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 max-w-2xl text-base md:text-lg mx-auto leading-relaxed"
          >
            Tra cứu thông tin bảo hành <strong>Phần cứng & Phần mềm</strong>, theo dõi tiến độ <strong>sửa chữa thiết bị</strong> nhanh chóng và tiện lợi
          </motion.p>

          {/* Service Highlights - SEO Friendly */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-4 pt-4"
            role="list"
            aria-label="Dịch vụ chính"
          >
            {[
              { icon: '🔍', text: 'Tra cứu bảo hành', color: 'from-blue-500 to-cyan-500' },
              { icon: '🔧', text: 'Sửa chữa thiết bị', color: 'from-indigo-500 to-purple-500' },
              { icon: '⚡', text: 'Xử lý nhanh chóng', color: 'from-purple-500 to-pink-500' },
            ].map((service, idx) => (
              <div
                key={idx}
                role="listitem"
                className="group flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:border-primary-300 transition-all hover:shadow-lg hover:scale-105"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform">{service.icon}</span>
                <span className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">{service.text}</span>
              </div>
            ))}
          </motion.div>
        </header>

        {/* Search Form Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 md:p-8"
          aria-label="Biểu mẫu tra cứu"
        >
          <div className="flex items-center gap-2 mb-8 text-primary-600 font-bold border-b border-slate-100 pb-4">
            <Search size={18} className="animate-pulse" />
            <h2 className="text-lg">Nhập thông tin khách hàng</h2>
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
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, searchType: 'repair', customerCode: '', customerPhone: '' });
                      setError(''); setResult(null);
                    }}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${formData.searchType === 'repair' ? 'bg-white text-primary-600 shadow-sm' : 'text-slate-500'
                      }`}
                  >
                    <Wrench size={14} className="inline mr-1" />
                    Sửa Chữa (Mã + SĐT)
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">{formData.searchType === 'repair' ? 'Mã Phiếu (SR-...) *' : 'Mã Khách Hàng *'}</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                <input type="text" required placeholder={formData.searchType === 'repair' ? "Nhập mã phiếu..." : "Nhập mã khách hàng..."} className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all bg-slate-50/30 text-slate-800 font-bold"
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
                  pattern={formData.searchType !== 'business' ? '[0-9]{10}' : undefined}
                  maxLength={formData.searchType !== 'business' ? '10' : undefined}
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
              <button
                disabled={loading}
                className="gradient-button text-white font-black py-4 px-12 rounded-2xl shadow-xl shadow-primary-500/30 transition-all flex items-center gap-3 disabled:opacity-50 active:scale-95 group relative"
                aria-label="Kiểm tra thông tin bảo hành và sửa chữa"
              >
                <div className="relative flex items-center gap-3 z-10">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span className="tracking-tight uppercase">ĐANG TRA CỨU...</span>
                    </>
                  ) : (
                    <>
                      <Search size={22} className="stroke-[3]" />
                      <span className="tracking-tight uppercase">KIỂM TRA NGAY</span>
                    </>
                  )}
                </div>
              </button>
            </div>
          </form>

          {error && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 p-4 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 border border-rose-100 shadow-sm">
              <XCircle size={20} /> <span className="font-semibold">{error}</span>
            </motion.div>
          )}
        </motion.section>

        <AnimatePresence>
          {result && (
            <section className="space-y-6" aria-label="Kết quả tra cứu">
              {/* Check if result is array with length > 0 */}
              {Array.isArray(result) ? (
                <>
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-slate-800 px-4 border-l-4 border-primary-500">
                      {selectedProduct ? 'Chi tiết sản phẩm' : `Tìm thấy ${result.length} sản phẩm`}
                    </h2>
                    {!selectedProduct && result.length > 0 && (
                      <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                        {result.length} kết quả
                      </span>
                    )}
                  </div>

                  {!selectedProduct ? (
                    <div className="grid grid-cols-1 gap-4">
                      {result.map((item, idx) => (
                        <motion.article
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          onClick={() => setSelectedProduct(item)}
                          className="card-hover bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer group relative overflow-hidden"
                          role="button"
                          tabIndex={0}
                          aria-label={`Xem chi tiết ${item.productName}`}
                        >
                          {/* Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary-50/0 via-primary-50/50 to-accent-50/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          <div className="flex items-center justify-between relative z-10">
                            <div className="flex-1">
                              <h3 className="font-bold text-slate-800 text-lg group-hover:text-primary-600 transition-colors">
                                {item.productName}
                              </h3>
                              <div className="flex items-center gap-3 mt-2 text-sm text-slate-500 flex-wrap">
                                <span className="bg-gradient-to-r from-slate-100 to-slate-50 px-3 py-1 rounded-lg text-xs font-mono font-bold border border-slate-200">
                                  {item.type === 'Software' ? item.licenseType : (Array.isArray(item.serialNumber) ? item.serialNumber[0] : item.serialNumber)}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center gap-1">
                                  {item.type === 'Software' ? '💾 Phần mềm' : item.type === 'Repair' ? '🔧 Sửa Chữa' : '🖥️ Thiết bị'}
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" size={24} />
                          </div>
                        </motion.article>
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
            </section>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Home;
