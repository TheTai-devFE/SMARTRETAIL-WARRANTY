import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { Building, ChevronRight, ExternalLink, Fingerprint, Phone, Plus, QrCode, Search, Trash2, Upload, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import { warrantyApi } from '../api';
import WarrantyForm from '../components/Admin/WarrantyForm';
import WarrantyTableRow from '../components/Admin/WarrantyTableRow';
import ConfirmModal from '../components/Shared/ConfirmModal';

const AdminDashboard = () => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => {}, type: 'danger' });
  const [qrModal, setQrModal] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });
  const [filters, setFilters] = useState({
    serialNumber: '',
    customerPhone: '',
    taxCode: '',
    companyName: '',
    customerType: 'Retail',
    page: 1
  });
  const [formData, setFormData] = useState({
    companyName: '',
    taxCode: '',
    customerPhone: '',
    productCode: '',
    productName: '',
    serialNumber: '', // String in form, converted to array on submit
    customerType: 'Retail',
    warrantyPeriod: 24,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    deliveryAddress: '',
    hasSoftware: false,
    softwareAccount: '',
    softwarePassword: '',
    playerId: '',
    licenseType: '1_Year',
    status: 'Pending',
    activationDate: '',
  });
  const [selectedIds, setSelectedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      // Clean filters before sending
      const cleanFilters = Object.keys(filters).reduce((acc, key) => {
        acc[key] = typeof filters[key] === 'string' ? filters[key].trim() : filters[key];
        return acc;
      }, {});
      
      const res = await warrantyApi.getAll(cleanFilters);
      setWarranties(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchWarranties();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [filters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingId ? 'Đang cập nhật...' : 'Đang tạo mới...');
    try {
      const { serialNumber, softwareAccount, softwarePassword, playerId, licenseType, ...rest } = formData;
      const payload = {
        ...rest,
        serialNumbers: formData.customerType === 'Project' 
          ? serialNumber.split('\n').map(s => s.trim()).filter(Boolean)
          : [serialNumber.trim()],
        hasSoftware: formData.hasSoftware,
        softwareInfo: formData.hasSoftware ? {
          softwareAccount,
          softwarePassword,
          playerId,
          licenseType,
        } : null
      };

      if (editingId) {
        await warrantyApi.update(editingId, payload);
        toast.success('Cập nhật thành công!', { id: loadingToast });
      } else {
        await warrantyApi.create(payload);
        toast.success('Tạo mới thành công!', { id: loadingToast });
      }
      setIsModalOpen(false);
      resetForm();
      fetchWarranties();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra', { id: loadingToast });
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const importData = new FormData();
    importData.append('file', file);
    const loadingToast = toast.loading('Đang xử lý file...');

    try {
      const res = await warrantyApi.import(importData);
      if (res.data.errors && res.data.errors.length > 0) {
        toast.error(`Có lỗi khi import: ${res.data.errors.length} bản ghi thất bại`, { id: loadingToast });
        // Optionally show all errors in a more detailed way, but for now just summary
      } else {
        toast.success(`Import thành công ${res.data.success} bản ghi!`, { id: loadingToast });
        fetchWarranties();
      }
    } catch (err) {
      toast.error('Lỗi import file', { id: loadingToast });
    }
    e.target.value = '';
  };

  const handleEdit = (warranty) => {
    setFormData({
      companyName: warranty.companyName || '',
      taxCode: warranty.taxCode || '',
      customerPhone: warranty.customerPhone,
      productCode: warranty.productCode,
      productName: warranty.productName,
      serialNumber: Array.isArray(warranty.serialNumber) ? warranty.serialNumber.join('\n') : warranty.serialNumber,
      customerType: warranty.customerType || 'Retail',
      warrantyPeriod: warranty.warrantyPeriod || 24,
      startDate: format(new Date(warranty.startDate), 'yyyy-MM-dd'),
      activationDate: warranty.activationDate ? format(new Date(warranty.activationDate), 'yyyy-MM-dd') : '',
      status: warranty.status || 'Pending',
      deliveryAddress: warranty.deliveryAddress || '',
      hasSoftware: warranty.hasSoftware || false,
      softwareAccount: warranty.softwareInfo?.softwareAccount || '',
      softwarePassword: warranty.softwareInfo?.softwarePassword || '',
      playerId: warranty.softwareInfo?.playerId || '',
      licenseType: warranty.softwareInfo?.licenseType || '1_Year',
    });
    setEditingId(warranty._id);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xóa bản ghi",
      message: "Bạn có chắc chắn muốn xóa bản ghi bảo hành này không? Hành động này không thể hoàn tác.",
      type: "danger",
      onConfirm: async () => {
        const loadingToast = toast.loading('Đang xóa...');
        try {
          await warrantyApi.delete(id);
          toast.success('Đã xóa bản ghi', { id: loadingToast });
          fetchWarranties();
        } catch (err) {
          toast.error('Không thể xóa bản ghi', { id: loadingToast });
        }
      }
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      taxCode: '',
      customerPhone: '',
      productCode: '',
      productName: '',
      serialNumber: '',
      customerType: 'Retail',
      warrantyPeriod: 24,
      startDate: format(new Date(), 'yyyy-MM-dd'),
      deliveryAddress: '',
      hasSoftware: false,
      softwareAccount: '',
      softwarePassword: '',
      playerId: '',
      licenseType: '1_Year',
      status: 'Pending',
      activationDate: '',
    });
    setEditingId(null);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(warranties.map(w => w._id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectItem = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = () => {
    setConfirmConfig({
      isOpen: true,
      title: "Xóa hàng loạt",
      message: `Bạn có chắc muốn xóa ${selectedIds.length} bản ghi đã chọn không?`,
      type: "danger",
      onConfirm: async () => {
        const loadingToast = toast.loading(`Đang xóa ${selectedIds.length} bản ghi...`);
        try {
          await warrantyApi.bulkDelete(selectedIds);
          setSelectedIds([]);
          toast.success('Đã xóa các bản ghi được chọn', { id: loadingToast });
          fetchWarranties();
        } catch (err) {
          toast.error('Lỗi khi xóa hàng loạt', { id: loadingToast });
        }
      }
    });
  };

  const getActivationUrl = (id) => {
    const base = window.location.origin;
    return `${base}/activate/${id}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Admin Navbar */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50 mb-8">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 font-black text-xl tracking-tighter hover:opacity-80 transition-opacity">
              <span className="bg-primary-500 text-white px-2 py-0.5 rounded-lg">S</span>
              SMARTRETAIL
            </a>
            <span className="h-6 w-px bg-slate-700"></span>
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary-400">Technician Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full border border-slate-700">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">System Online</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">Quản Lý <span className="text-primary-600">Bảo Hành</span></h1>
            <p className="text-slate-500 font-medium">Nâng cấp v2.0: Hỗ trợ Dự án và Kích hoạt QR Code.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImport} 
              accept=".xlsx,.xls" 
              className="hidden" 
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-6 rounded-xl border border-slate-200 transition-all flex items-center gap-2 shadow-sm"
            >
              <Upload size={18} /> Nhập Excel
            </button>
            <button
               onClick={() => { resetForm(); setIsModalOpen(true); }}
               className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
             >
               <Plus size={20} /> Thêm Bảo Hành
             </button>
           </div>
         </div>

         {/* Bulk Actions */}
         <AnimatePresence>
           {selectedIds.length > 0 && (
             <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center justify-between shadow-sm"
             >
               <div className="flex items-center gap-3">
                 <div className="bg-rose-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-black">
                   {selectedIds.length}
                 </div>
                 <p className="text-sm font-bold text-rose-700">bản ghi đang được chọn</p>
               </div>
               <button 
                 onClick={handleBulkDelete}
                 className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg text-xs font-black flex items-center gap-2 transition-all shadow-md active:scale-95"
               >
                 <Trash2 size={14} /> XÓA HÀNG LOẠT
               </button>
             </motion.div>
           )}
         </AnimatePresence>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            <div className="relative group">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Serial Number..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-bold bg-white placeholder:text-slate-300"
                value={filters.serialNumber}
                onChange={(e) => setFilters({...filters, serialNumber: e.target.value.toUpperCase(), page: 1})}
              />
            </div>
            <div className="relative group">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Số điện thoại..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium bg-white placeholder:text-slate-300"
                value={filters.customerPhone}
                onChange={(e) => setFilters({...filters, customerPhone: e.target.value, page: 1})}
              />
            </div>
            <div className="relative group">
              <Fingerprint size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Mã số thuế..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-mono font-bold bg-white placeholder:text-slate-300"
                value={filters.taxCode}
                onChange={(e) => setFilters({...filters, taxCode: e.target.value, page: 1})}
              />
            </div>
            <div className="relative group">
              <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
              <input
                type="text"
                placeholder="Tên khách hàng..."
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium bg-white placeholder:text-slate-300"
                value={filters.companyName}
                onChange={(e) => setFilters({...filters, companyName: e.target.value, page: 1})}
              />
            </div>
          </div>
          
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[20px] w-full md:w-auto">
            {['', 'Retail', 'Dealer', 'Project'].map((type) => (
              <button
                key={type}
                onClick={() => setFilters({...filters, customerType: type, page: 1})}
                className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  filters.customerType === type 
                    ? 'bg-white text-primary-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {type === '' ? 'Tất cả' : type === 'Retail' ? 'Bán lẻ' : type === 'Dealer' ? 'Đại lý' : 'Dự án'}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setFilters({ serialNumber: '', customerPhone: '', taxCode: '', companyName: '', customerType: '', page: 1 })}
            className="p-3 text-slate-400 hover:text-rose-500 transition-colors rounded-2xl hover:bg-rose-50 border border-transparent hover:border-rose-100"
            title="Xóa bộ lọc"
          >
            <X size={20} />
          </button>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden shadow-xl border border-white/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-widest">
                <tr>
                  <th className="px-6 py-4 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                      onChange={handleSelectAll}
                      checked={warranties.length > 0 && selectedIds.length === warranties.length}
                    />
                  </th>
                  <th className="px-6 py-4">Sản phẩm / Serial</th>
                  <th className="px-6 py-4">Khách hàng / Địa chỉ</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Thời hạn</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="7" className="px-6 py-20 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
                ) : warranties.length === 0 ? (
                  <tr><td colSpan="7" className="px-6 py-20 text-center text-slate-400 font-medium">Không tìm thấy bản ghi nào.</td></tr>
                ) : (
                  warranties.map((warranty) => (
                    <WarrantyTableRow
                      key={warranty._id}
                      warranty={warranty}
                      isSelected={selectedIds.includes(warranty._id)}
                      onToggleSelect={handleSelectItem}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onShowQR={setQrModal}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Hiển thị {warranties.length} của {pagination.total} bản ghi
            </p>
            <div className="flex gap-2">
              <button 
                disabled={pagination.page <= 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-all"
              >
                Trước
              </button>
              <div className="flex gap-1">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      pagination.page === i + 1 
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent transition-all"
              >
                Sau
              </button>
            </div>
          </div>
        </div>

        {/* Modal QR Code */}
        <AnimatePresence>
          {qrModal && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
                onClick={() => setQrModal(null)}
              ></motion.div>
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative z-10 text-center"
              >
                <div className="mb-6">
                  <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <QrCode className="text-primary-600" size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">Mã QR Kích Hoạt</h3>
                  <p className="text-slate-500 text-sm mt-2">Dán mã này lên thiết bị để khách hàng quét và tự kích hoạt bảo hành.</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-inner inline-block mb-6">
                  <QRCode value={getActivationUrl(qrModal._id)} size={200} />
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(getActivationUrl(qrModal._id));
                      toast.success('Đã sao chép link kích hoạt!');
                    }}
                    className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                  >
                    <ExternalLink size={18} /> Sao chép link
                  </button>
                  <button 
                    onClick={() => setQrModal(null)}
                    className="w-full py-3 font-bold text-slate-500 hover:text-slate-700 transition-all"
                  >
                    Đóng
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" 
                onClick={() => setIsModalOpen(false)}
              ></motion.div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl md:rounded-[32px] shadow-2xl w-full max-w-4xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden border border-slate-100"
              >
                {/* Modal Header */}
                <div className="px-8 py-6 border-b bg-gradient-to-r from-slate-50 to-white flex justify-between items-center shrink-0">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></span>
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                        {editingId ? 'Chỉnh sửa bảo hành' : 'Tạo mới bảo hành'}
                      </h2>
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">
                      {editingId ? 'System Configuration Update' : 'Initialize New Warranty Record'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Form Body - Scrollable */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                  <form id="warrantyForm" onSubmit={handleSubmit} className="space-y-10">
                    <WarrantyForm
                      formData={formData} 
                      setFormData={setFormData}
                      editingId={editingId}
                    />
                  </form>
                </div>

                {/* Modal Footer */}
                <div className="px-8 py-6 border-t bg-slate-50 flex gap-4 shrink-0">
                  <button 
                    form="warrantyForm"
                    type="submit" 
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary-500/30 uppercase tracking-widest text-xs flex items-center justify-center gap-2 group"
                  >
                    {editingId ? (
                      <>Cập nhật hệ thống <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                    ) : (
                      <>Kích hoạt lưu trữ <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="px-10 py-4 font-black text-slate-500 hover:bg-white rounded-2xl transition-all border border-slate-200 shadow-sm hover:shadow-md uppercase tracking-widest text-[10px]"
                  >
                    Hủy bỏ
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <ConfirmModal 
          {...confirmConfig}
          onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
