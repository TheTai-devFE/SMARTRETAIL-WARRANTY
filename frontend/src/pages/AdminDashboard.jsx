import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Edit2, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { warrantyApi } from '../api';

const AdminDashboard = () => {
  const [warranties, setWarranties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    serialNumber: '',
    customerPhone: '',
    taxCode: '',
    companyName: ''
  });
  const [formData, setFormData] = useState({
    companyName: '',
    taxCode: '',
    customerPhone: '',
    productCode: '',
    productName: '',
    serialNumber: '',
    startDate: '',
    endDate: ''
  });
  const [editingId, setEditingId] = useState(null);

  const fetchWarranties = async () => {
    try {
      setLoading(true);
      const res = await warrantyApi.getAll(filters);
      setWarranties(res.data);
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
    try {
      if (editingId) {
        await warrantyApi.update(editingId, formData);
      } else {
        await warrantyApi.create(formData);
      }
      setIsModalOpen(false);
      resetForm();
      fetchWarranties();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (warranty) => {
    setFormData({
      companyName: warranty.companyName || '',
      taxCode: warranty.taxCode || '',
      customerPhone: warranty.customerPhone,
      productCode: warranty.productCode,
      productName: warranty.productName,
      serialNumber: warranty.serialNumber,
      startDate: format(new Date(warranty.startDate), 'yyyy-MM-dd'),
      endDate: format(new Date(warranty.endDate), 'yyyy-MM-dd')
    });
    setEditingId(warranty._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bản ghi này?')) {
      try {
        await warrantyApi.delete(id);
        fetchWarranties();
      } catch (err) {
        alert('Không thể xóa bản ghi');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      taxCode: '',
      customerPhone: '',
      productCode: '',
      productName: '',
      serialNumber: '',
      startDate: '',
      endDate: ''
    });
    setEditingId(null);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Quản Lý <span className="text-primary-600">Bảo Hành</span></h1>
          <p className="text-slate-500">Quản lý và cập nhật danh sách thiết bị bảo hành của hệ thống.</p>
        </div>
        <button
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} /> Thêm mới
        </button>
      </div>

      <div className="glass-card p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Số Serial..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            value={filters.serialNumber}
            onChange={(e) => setFilters({...filters, serialNumber: e.target.value})}
          />
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Số điện thoại..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            value={filters.customerPhone}
            onChange={(e) => setFilters({...filters, customerPhone: e.target.value})}
          />
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Mã số thuế..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            value={filters.taxCode}
            onChange={(e) => setFilters({...filters, taxCode: e.target.value})}
          />
        </div>
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Tên công ty..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            value={filters.companyName}
            onChange={(e) => setFilters({...filters, companyName: e.target.value})}
          />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-4">Sản phẩm / Serial</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Ngày bắt đầu</th>
                <th className="px-6 py-4">Ngày kết thúc</th>
                <th className="px-6 py-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
              ) : warranties.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-medium">Không tìm thấy bản ghi nào.</td></tr>
              ) : warranties.map((w) => (
                <tr key={w._id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-800">{w.productName}</p>
                    <p className="text-xs text-slate-500 font-mono uppercase truncate max-w-[150px]">SN: {w.serialNumber}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-sm">{w.companyName || 'Khách lẻ'}</p>
                    <p className="text-xs text-slate-500">{w.customerPhone}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">{format(new Date(w.startDate), 'dd/MM/yyyy')}</td>
                  <td className="px-6 py-4 text-sm font-medium">{format(new Date(w.endDate), 'dd/MM/yyyy')}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(w)} className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(w._id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden"
          >
            <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingId ? 'Chỉnh sửa bảo hành' : 'Tạo mới bảo hành'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><Plus className="rotate-45" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Tên khách hàng/Công ty</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Mã số thuế</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.taxCode} onChange={e => setFormData({...formData, taxCode: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Số điện thoại *</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.customerPhone} onChange={e => setFormData({...formData, customerPhone: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Số Serial *</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.serialNumber} onChange={e => setFormData({...formData, serialNumber: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Tên sản phẩm *</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.productName} onChange={e => setFormData({...formData, productName: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Mã sản phẩm *</label>
                <input required type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.productCode} onChange={e => setFormData({...formData, productCode: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Ngày bắt đầu</label>
                <input required type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Ngày kết thúc</label>
                <input required type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-primary-500" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} />
              </div>
              <div className="md:col-span-2 pt-4 flex gap-3">
                <button type="submit" className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-primary-500/20">
                  {editingId ? 'Cập nhật bản ghi' : 'Tạo bản ghi mới'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">Hủy</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminDashboard;
