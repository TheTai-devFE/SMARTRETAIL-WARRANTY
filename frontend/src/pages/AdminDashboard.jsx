import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { AppWindow, Building, ChevronRight, Copy, Fingerprint, HardDrive, Phone, Plus, Printer, QrCode, Search, Trash2, Upload, Wrench, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { repairApi, softwareApi, warrantyApi } from '../api';
import logoPrint from '../assets/LOGO SR.png';
import logoSR from '../assets/logo-white.png';
import logoQR from '../assets/logo.jpg';
import RepairTableRow from '../components/Admin/RepairTableRow';
import SoftwareForm from '../components/Admin/SoftwareForm';
import SoftwareTableRow from '../components/Admin/SoftwareTableRow';
import WarrantyForm from '../components/Admin/WarrantyForm';
import WarrantyTableRow from '../components/Admin/WarrantyTableRow';
import QRLabelPrint from '../components/QRLabelPrint';
import RepairReceiptPrint from '../components/RepairReceiptPrint';
import ConfirmModal from '../components/Shared/ConfirmModal';
import { convertImageToBase64, createRoundedLogoDataURL } from '../utils/qrLogo';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Hardware'); // 'Hardware' | 'Software'
  const [warranties, setWarranties] = useState([]);
  const [softwareList, setSoftwareList] = useState([]);
  const [repairRequests, setRepairRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [printReceipt, setPrintReceipt] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, title: '', message: '', onConfirm: () => { }, type: 'danger' });
  const [qrModal, setQrModal] = useState(null);
  const [roundedLogo, setRoundedLogo] = useState(null);
  const [printLogoBase64, setPrintLogoBase64] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  // Shared filters structure
  const [filters, setFilters] = useState({
    serialNumber: '',
    customerPhone: '',
    taxCode: '',
    companyName: '',
    customerType: 'Retail',
    customerCode: '', // New
    productName: '', // For software
    page: 1
  });

  // Shared Form Data
  const [formData, setFormData] = useState({
    // Common
    customerCode: '',
    companyName: '',
    taxCode: '',
    customerPhone: '',
    productName: '',

    // Hardware
    productCode: '',
    serialNumber: '',
    customerType: 'Retail',
    warrantyPeriod: 24,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    deliveryAddress: '',
    hasSoftware: false,

    // Software
    softwareAccount: '',
    softwarePassword: '',
    playerId: '',
    licenseType: '1_Year',
    licenseStatus: 'Pending',
    deviceLimit: 1,

    status: 'Pending',
    activationDate: '',
  });

  const [selectedIds, setSelectedIds] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  const [productItems, setProductItems] = useState([]); // List for Retail Batch

  const fetchData = async () => {
    try {
      setLoading(true);
      const cleanFilters = Object.keys(filters).reduce((acc, key) => {
        acc[key] = typeof filters[key] === 'string' ? filters[key].trim() : filters[key];
        return acc;
      }, {});

      if (activeTab === 'Hardware') {
        const res = await warrantyApi.getAll(cleanFilters);
        setWarranties(res.data.data);
        setPagination(res.data.pagination);
      } else if (activeTab === 'Software') {
        const res = await softwareApi.getAll(cleanFilters);
        setSoftwareList(res.data.data);
        setPagination(res.data.pagination);
      } else if (activeTab === 'Repair') {
        const res = await repairApi.getAll();
        setRepairRequests(res.data);
        setPagination({ total: res.data.length, page: 1, totalPages: 1 });
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  // Create rounded logo on mount
  useEffect(() => {
    createRoundedLogoDataURL(logoQR).then(setRoundedLogo);
    convertImageToBase64(logoPrint).then(setPrintLogoBase64);
  }, []);

  useEffect(() => {
    // Reset page on tab change
    setFilters(prev => ({ ...prev, page: 1 }));
    setSelectedIds([]);
  }, [activeTab]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [filters, activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingId ? 'Đang cập nhật...' : 'Đang tạo mới...');
    try {
      if (activeTab === 'Hardware') {
        // DETECT BATCH MODE (Retail + Items in List OR Retail + current form has product data)
        let finalProductItems = [...productItems];

        // Auto-add current form product if it has data (user might not have clicked "Add to list")
        if (!editingId && formData.customerType === 'Retail' && formData.productName && formData.serialNumber) {
          const currentFormProduct = {
            id: Date.now(),
            productName: formData.productName,
            productCode: formData.productCode,
            serialNumber: formData.serialNumber,
            startDate: formData.startDate,
            warrantyPeriod: formData.warrantyPeriod,
            hasSoftware: formData.hasSoftware,
            softwareInfo: formData.hasSoftware ? {
              softwareAccount: formData.softwareAccount,
              softwarePassword: formData.softwarePassword,
              playerId: formData.playerId,
              licenseType: formData.licenseType
            } : null
          };
          finalProductItems.push(currentFormProduct);
        }

        const isBatchMode = !editingId && formData.customerType === 'Retail' && finalProductItems.length > 0;

        if (isBatchMode) {
          // Batch Creation Payload
          const customerData = {
            companyName: formData.companyName,
            taxCode: formData.taxCode,
            customerPhone: formData.customerPhone,
            customerType: 'Retail',
            deliveryAddress: formData.deliveryAddress,
            customerCode: formData.customerCode
          };

          // Transform finalProductItems to include serialNumbers array for backend
          const transformedProducts = finalProductItems.map(item => ({
            ...item,
            serialNumbers: [item.serialNumber] // Backend expects serialNumbers array
          }));

          const payload = {
            batch: true,
            customerData,
            products: transformedProducts
          };

          await warrantyApi.create(payload);
        } else {
          // Normal Single/Project Creation
          const { serialNumber, softwareAccount, softwarePassword, playerId, licenseType, ...rest } = formData;
          const payload = {
            ...rest,
            serialNumbers: formData.customerType === 'Project'
              ? serialNumber.split('\n').map(s => s.trim()).filter(Boolean)
              : [serialNumber.trim()],
            hasSoftware: formData.hasSoftware,
            softwareInfo: formData.hasSoftware ? {
              softwareAccount, softwarePassword, playerId, licenseType
            } : null
          };

          if (editingId) {
            await warrantyApi.update(editingId, payload);
          } else {
            await warrantyApi.create(payload);
          }
        }
      } else {
        // Software Submit
        if (editingId) {
          await softwareApi.update(editingId, formData);
        } else {
          await softwareApi.create(formData);
        }
      }

      toast.success(editingId ? 'Cập nhật thành công!' : 'Tạo mới thành công!', { id: loadingToast });
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra', { id: loadingToast });
    }
  };

  // Import only for Hardware for now
  const handleImport = async (e) => {
    // ... logic kept same for Hardware import ...
    // If user wants to import Software, need new logic. Keeping simple for now.
    const file = e.target.files[0];
    if (!file) return;

    const importData = new FormData();
    importData.append('file', file);
    const loadingToast = toast.loading('Đang xử lý file...');

    try {
      const res = await warrantyApi.import(importData);
      if (res.data.errors && res.data.errors.length > 0) {
        toast.error(`Có lỗi khi import: ${res.data.errors.length} bản ghi thất bại`, { id: loadingToast });
      } else {
        toast.success(`Import thành công ${res.data.success} bản ghi!`, { id: loadingToast });
        fetchData();
      }
    } catch (err) {
      toast.error('Lỗi import file', { id: loadingToast });
    }
    e.target.value = '';
  };

  const handleEdit = async (item) => {
    try {
      if (activeTab === 'Hardware') {
        // Fetch full details (including Project/Master software linking logic)
        const res = await warrantyApi.getById(item._id);
        const fullItem = res.data;

        setFormData({
          companyName: fullItem.companyName || '',
          taxCode: fullItem.taxCode || '',
          customerPhone: fullItem.customerPhone,
          productCode: fullItem.productCode,
          productName: fullItem.productName,
          serialNumber: Array.isArray(fullItem.serialNumber) ? fullItem.serialNumber.join('\n') : fullItem.serialNumber,
          customerType: fullItem.customerType || 'Retail',
          warrantyPeriod: fullItem.warrantyPeriod || 24,
          startDate: format(new Date(fullItem.startDate), 'yyyy-MM-dd'),
          activationDate: fullItem.activationDate ? format(new Date(fullItem.activationDate), 'yyyy-MM-dd') : '',
          status: fullItem.status || 'Pending',
          deliveryAddress: fullItem.deliveryAddress || '',
          // Use hasSoftware from fullItem (computed by backend for Projects)
          hasSoftware: fullItem.hasSoftware || false,
          // Keep legacy mapping
          customerCode: fullItem.customerCode || '',
          softwareAccount: fullItem.softwareInfo?.softwareAccount || '',
          softwarePassword: fullItem.softwareInfo?.softwarePassword || '',
          playerId: fullItem.softwareInfo?.playerId || '',
          licenseType: fullItem.softwareInfo?.licenseType || '1_Year',
        });
      } else {
        // Software (already full details in list usually, but safer to use item)
        setFormData({
          customerCode: item.customerCode || '',
          companyName: item.companyName || '',
          taxCode: item.taxCode || '',
          customerPhone: item.customerPhone || '',
          productName: item.productName || '',
          softwareAccount: item.softwareAccount || '',
          softwarePassword: item.softwarePassword || '',
          playerId: item.playerId || '',
          licenseType: item.licenseType || '1_Year',
          licenseStatus: item.licenseStatus || 'Pending',
          deviceLimit: item.deviceLimit || 1,
        });
      }
      setEditingId(item._id);
      setIsModalOpen(true);
    } catch (error) {
      toast.error('Không thể tải chi tiết bản ghi');
      console.error(error);
    }
  };

  const handleDelete = (id) => {
    setConfirmConfig({
      isOpen: true,
      title: "Xóa bản ghi",
      message: "Bạn có chắc chắn muốn xóa bản ghi này không? Hành động này không thể hoàn tác.",
      type: "danger",
      onConfirm: async () => {
        const loadingToast = toast.loading('Đang xóa...');
        try {
          if (activeTab === 'Hardware') {
            await warrantyApi.delete(id);
          } else if (activeTab === 'Software') {
            await softwareApi.delete(id);
          } else {
            await repairApi.delete(id);
          }
          toast.success('Đã xóa bản ghi', { id: loadingToast });
          fetchData();
        } catch (err) {
          toast.error('Không thể xóa bản ghi', { id: loadingToast });
        }
      }
    });
  };

  const [statusUpdate, setStatusUpdate] = useState({ id: null, status: '', showModal: false, duration: '0' });

  const handleUpdateRepairStatus = async (id, status) => {
    if (status === 'completed') {
      setStatusUpdate({ id, status, showModal: true, duration: '0' });
    } else {
      await updateStatusAPI(id, status);
    }
  };

  const updateStatusAPI = async (id, status, warrantyDuration) => {
    const loadingToast = toast.loading('Đang cập nhật...');
    try {
      await repairApi.updateStatus(id, status, warrantyDuration);
      toast.success('Cập nhật trạng thái thành công', { id: loadingToast });
      fetchData();
    } catch (error) {
      toast.error('Lỗi cập nhật trạng thái', { id: loadingToast });
    }
  };

  const confirmWarrantyUpdate = async () => {
    const { id, status, duration } = statusUpdate;
    if (!id) return;
    setStatusUpdate({ ...statusUpdate, showModal: false }); // Close modal
    await updateStatusAPI(id, status, duration);
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
      customerCode: '',
      licenseStatus: 'Pending',
      deviceLimit: 1
    });
    setEditingId(null);
    setProductItems([]);
  };

  const handleSelectAll = (e) => {
    let list = [];
    if (activeTab === 'Hardware') list = warranties;
    else if (activeTab === 'Software') list = softwareList;
    else list = repairRequests;

    if (e.target.checked) {
      setSelectedIds(list.map(w => w._id));
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
          if (activeTab === 'Hardware') {
            await warrantyApi.bulkDelete(selectedIds);
          } else if (activeTab === 'Software') {
            await softwareApi.bulkDelete(selectedIds);
          } else {
            // Maybe implement bulk delete for repair later
            // For now just loop delete or warn
            await Promise.all(selectedIds.map(id => repairApi.delete(id)));
          }
          setSelectedIds([]);
          toast.success('Đã xóa các bản ghi được chọn', { id: loadingToast });
          fetchData();
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
    <div className="min-h-screen bg-slate-50 pb-20 font-sans relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary-50/50 via-accent-50/30 to-transparent -z-10 blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-l from-accent-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation"></div>
      <div className="absolute bottom-40 left-0 w-96 h-96 bg-gradient-to-r from-primary-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation" style={{ animationDelay: '1s' }}></div>

      <nav className="bg-slate-900 text-white sticky top-0 z-50 mb-8">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter group transition-transform active:scale-95">
              <img src={logoSR} alt="Smart Retail Logo" className="h-8 md:h-10 w-auto" />
            </Link>
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
            <h1 className="text-3xl font-extrabold text-slate-900">Quản lý <span className="text-primary-600">bảo hành</span></h1>
          </div>
          <div className="flex flex-wrap gap-3">
            {activeTab === 'Hardware' && (
              <>
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
              </>
            )}
            {activeTab !== 'Repair' && (
              <button
                onClick={() => { resetForm(); setIsModalOpen(true); }}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Plus size={20} /> Thêm {activeTab === 'Hardware' ? 'Phần Cứng' : 'Phần Mềm'}
              </button>
            )}
          </div>
        </div>

        {/* TABS */}
        <div className="flex p-1 bg-slate-200 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('Hardware')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'Hardware' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <HardDrive size={18} /> Phần cứng
          </button>
          <button
            onClick={() => setActiveTab('Software')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'Software' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <AppWindow size={18} /> Phần mềm
          </button>
          <button
            onClick={() => setActiveTab('Repair')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'Repair' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            <Wrench size={18} /> Sửa chữa
          </button>
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
                <Trash2 size={14} /> Xóa hàng loạt
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
            {activeTab === 'Hardware' ? (
              // Hardware Filters
              <div className="relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Serial Number..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-bold bg-white placeholder:text-slate-300"
                  value={filters.serialNumber}
                  onChange={(e) => setFilters({ ...filters, serialNumber: e.target.value.toUpperCase(), page: 1 })}
                />
              </div>
            ) : activeTab === 'Software' ? (
              // Software Filters
              <div className="relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Mã Khách Hàng / Tên PM..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-bold bg-white placeholder:text-slate-300"
                  value={filters.customerCode}
                  onChange={(e) => setFilters({ ...filters, customerCode: e.target.value, page: 1 })}
                />
              </div>
            ) : null}

            {activeTab !== 'Repair' && (
              <>
                <div className="relative group">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Số điện thoại..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium bg-white placeholder:text-slate-300"
                    value={filters.customerPhone}
                    onChange={(e) => setFilters({ ...filters, customerPhone: e.target.value, page: 1 })}
                  />
                </div>
                <div className="relative group">
                  <Fingerprint size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Mã số thuế..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-mono font-bold bg-white placeholder:text-slate-300"
                    value={filters.taxCode}
                    onChange={(e) => setFilters({ ...filters, taxCode: e.target.value, page: 1 })}
                  />
                </div>
                <div className="relative group">
                  <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Tên khách hàng..."
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium bg-white placeholder:text-slate-300"
                    value={filters.companyName}
                    onChange={(e) => setFilters({ ...filters, companyName: e.target.value, page: 1 })}
                  />
                </div>
              </>
            )}
          </div>

          {activeTab === 'Hardware' && (
            <div className="flex gap-2 bg-slate-100 p-1.5 rounded-[20px] w-full md:w-auto">
              {['', 'Retail', 'Dealer', 'Project'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilters({ ...filters, customerType: type, page: 1 })}
                  className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${filters.customerType === type
                    ? 'bg-white text-primary-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {type === '' ? 'Tất cả' : type === 'Retail' ? 'Bán lẻ' : type === 'Dealer' ? 'Đại lý' : 'Dự án'}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setFilters({ serialNumber: '', customerPhone: '', taxCode: '', companyName: '', customerType: '', customerCode: '', productName: '', page: 1 })}
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
                      checked={((activeTab === 'Hardware' ? warranties : activeTab === 'Software' ? softwareList : repairRequests).length > 0) && (selectedIds.length === (activeTab === 'Hardware' ? warranties : activeTab === 'Software' ? softwareList : repairRequests).length)}
                    />
                  </th>
                  {activeTab === 'Repair' ? (
                    <>
                      <th className="px-6 py-4">Sản phẩm</th>
                      <th className="px-6 py-4">Khách hàng</th>
                      <th className="px-6 py-4">Mô tả lỗi</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4">Ngày tạo</th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4">Sản phẩm / {activeTab === 'Hardware' ? 'Model' : 'Mã KH'}</th>
                      <th
                        className={`px-6 py-4 ${activeTab === 'Hardware' ? '' : 'hidden'}`}
                      >
                        Mã Khách Hàng
                      </th>
                      <th className="px-6 py-4">{activeTab === 'Hardware' ? 'Serial' : 'Loại License'}</th>
                      {activeTab === 'Software' && <th className="px-6 py-4">Số lượng</th>}
                      <th className="px-6 py-4">Khách hàng / Địa chỉ / SĐT</th>
                      <th className="px-6 py-4">Trạng thái</th>
                      <th className="px-6 py-4">Thời hạn</th>
                    </>
                  )}
                  <th className="px-6 py-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan={activeTab === 'Hardware' ? "7" : activeTab === 'Software' ? "8" : "7"} className="px-6 py-20 text-center text-slate-400">Đang tải dữ liệu...</td></tr>
                ) : (activeTab === 'Hardware' ? warranties : activeTab === 'Software' ? softwareList : repairRequests).length === 0 ? (
                  <tr><td colSpan={activeTab === 'Hardware' ? "7" : activeTab === 'Software' ? "8" : "7"} className="px-6 py-20 text-center text-slate-400 font-medium">Không tìm thấy bản ghi nào.</td></tr>
                ) : (
                  (activeTab === 'Hardware' ? warranties : activeTab === 'Software' ? softwareList : repairRequests).map((item) => (
                    activeTab === 'Hardware' ? (
                      <WarrantyTableRow
                        key={item._id}
                        warranty={item}
                        isSelected={selectedIds.includes(item._id)}
                        onToggleSelect={handleSelectItem}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onShowQR={setQrModal}
                      />
                    ) : activeTab === 'Software' ? (
                      <SoftwareTableRow
                        key={item._id}
                        software={item}
                        isSelected={selectedIds.includes(item._id)}
                        onToggleSelect={handleSelectItem}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    ) : (
                      <RepairTableRow
                        key={item._id}
                        request={item}
                        onDelete={handleDelete}
                        onUpdateStatus={handleUpdateRepairStatus}
                        onPrint={(req) => setPrintReceipt(req)}
                      />
                    )
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
              Hiển thị {(activeTab === 'Hardware' ? warranties : activeTab === 'Software' ? softwareList : repairRequests).length} của {pagination.total} bản ghi
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
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${pagination.page === i + 1
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
                {/* QR Content */}
                <div className="mb-6">
                  <div className="bg-primary-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <QrCode className="text-primary-600" size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">Mã QR kích hoạt</h3>
                  <p className="text-slate-500 text-sm mt-2">Dán mã này lên thiết bị để khách hàng quét và tự kích hoạt bảo hành.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-inner inline-block mb-6">
                  {roundedLogo ? (
                    <QRCodeSVG
                      value={getActivationUrl(qrModal._id)}
                      size={200}
                      level="H"
                      includeMargin={false}
                      imageSettings={{
                        src: roundedLogo,
                        height: 64,
                        width: 64,
                        excavate: true,
                      }}
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] flex items-center justify-center">
                      <p className="text-slate-400">Đang tải...</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {/* Two buttons side by side */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(getActivationUrl(qrModal._id));
                        toast.success('Đã sao chép link kích hoạt!');
                      }}
                      className="bg-slate-900 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                    >
                      <Copy size={18} /> Sao chép
                    </button>
                    <button
                      onClick={() => {
                        // Open new window for printing QR label
                        const printWindow = window.open('', '_blank', 'width=700,height=400');
                        const labelHTML = `
                          <!DOCTYPE html>
                         <html>
                        <head>
                          <meta charset="UTF-8">
                          <title>QR Label</title>
                          <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
                          <style>
                            @media print {
                              @page {
                                /* BƯỚC 1: Đổi kích thước thành DỌC (ngược với kích thước thật của tem) */
                                /* Máy in sẽ hiểu: Rộng 40mm, Dài 58mm */
                                size: 40mm 58mm; 
                                margin: 0;
                              }
                              body {
                                /* Force in màu */
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                              }
                            }

                            * { margin: 0; padding: 0; box-sizing: border-box; }

                            body {
                              /* Body set theo khổ dọc của máy in */
                              width: 40mm;
                              height: 58mm;
                              margin: 0;
                              background: white;
                            }

                            /* BƯỚC 2: Tạo một container để xoay nội dung */
                            .rotate-wrapper {
                              /* Kích thước thật của tem */
                              width: 58mm;
                              height: 40mm;
                              
                              /* Kỹ thuật xoay: */
                              position: absolute;
                              top: 0;
                              left: 0;
                              transform-origin: top left;
                              
                              /* Dời sang phải 40mm rồi xoay 90 độ */
                              transform: translate(40mm, 0) rotate(90deg); 
                              
                              /* Background trắng đè lên mọi thứ */
                              background: white; 
                            }

                            /* Các class bên trong giữ nguyên layout cũ */
                            .label {
                              width: 100%;
                              height: 100%;
                              padding: 1.5mm;
                              display: flex;
                              flex-direction: row;
                              align-items: stretch;
                            }

                            .qr-section {
                              width: 50%;
                              height: 100%;
                              display: flex;
                              align-items: center;
                              justify-content: center;
                              
                              padding: 0;
                              border-right: 0.3mm dashed #ccc;
                            }
                            .qr-section svg { 
                              width: 34mm; 
                              height: 34mm; 
                            }
                            
                            .info-section {
                              width: 50%;
                              display: flex;
                              flex-direction: column;
                              justify-content: center;
                              gap: 1.2mm;
                              padding: 1mm 1mm 1mm 2mm;
                              overflow: hidden;
                            }
                            
                            .logo { height: 5mm; width: auto; object-fit: contain; }
                            
                            .product {
                              font-size: 7pt;
                              font-weight: 700;
                              color: #000;
                              line-height: 1.2;
                              display: -webkit-box;
                              -webkit-line-clamp: 2;
                              -webkit-box-orient: vertical;
                              overflow: hidden;
                            }
                            
                            .instruction { font-size: 5.5pt; color: #555; font-style: italic; }
                            
                            .footer {
                              display: flex;
                              align-items: center;
                              gap: 1mm;
                              margin-top: 1mm;
                            }
                            .footer svg { width: 2.5mm; height: 2.5mm; fill: #4361ee; }
                            .website { font-size: 5pt; color: #4361ee; font-weight: 500; }

                          </style>
                        </head>
                        <body>
                          <div class="rotate-wrapper">
                            <div class="label">
                              <div class="qr-section" id="qrcode"></div>
                              <div class="info-section">
                                <img class="logo" src="${printLogoBase64}" alt="Smart Retail" />
                                <div class="product">${qrModal.productName}</div>
                                <div class="instruction">Quét mã kích hoạt BH</div>
                                <div class="instruction">Hotline: 0935 888 489</div>
                                <div class="instruction">KT: 0909 045 663</div>
                                <div class="footer">
                                  <svg viewBox="0 0 24 24" fill="#4361ee">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                                  </svg>
                                  <span class="website">smartretail.com.vn</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <script>
                            var qr = qrcode(0, 'H');
                            qr.addData('${getActivationUrl(qrModal._id)}');
                            qr.make();
                            
                            var qrContainer = document.getElementById('qrcode');
                            qrContainer.innerHTML = qr.createSvgTag({ scalable: true });
                            var svgElement = qrContainer.querySelector('svg');
                            svgElement.style.width = '100%';
                            svgElement.style.height = '100%';

                            // var logoImg = document.createElement('img');
                            // logoImg.src = '${roundedLogo}';
                            // logoImg.style.cssText = 'position: absolute; right: 50%; left: 50%; transform: translate(-50%, -50%); width: 20%; height: 20%; border-radius: 50%; background: white; padding: 1px; z-index: 10;';
                            // qrContainer.style.position = 'relative';
                            // qrContainer.appendChild(logoImg);
                            
                            setTimeout(function() {
                              window.print();
                            }, 500);
                          </script>
                        </body>
                        </html>
                        `;
                        printWindow.document.write(labelHTML);
                        printWindow.document.close();
                      }}
                      className="bg-primary-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all"
                    >
                      <Printer size={18} /> In tem
                    </button>
                  </div>
                  <button
                    onClick={() => setQrModal(null)}
                    className="w-full py-3 font-bold text-slate-500 hover:text-slate-700 transition-all"
                  >
                    Đóng
                  </button>
                </div>

                {/* Hidden Print Component - Only visible when printing */}
                <div style={{ display: 'none' }} className="print-only-label">
                  <QRLabelPrint
                    activationUrl={getActivationUrl(qrModal._id)}
                    productName={qrModal.productName}
                  />
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
                        {editingId ? 'Chỉnh sửa' : 'Tạo mới'} {activeTab === 'Hardware' ? 'Bảo hành' : 'Phần mềm'}
                      </h2>
                    </div>
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
                    {activeTab === 'Hardware' ? (
                      <WarrantyForm
                        formData={formData}
                        setFormData={setFormData}
                        editingId={editingId}
                        productItems={productItems}
                        setProductItems={setProductItems}
                      />
                    ) : (
                      <SoftwareForm
                        formData={formData}
                        setFormData={setFormData}
                        editingId={editingId}
                      />
                    )}
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
                      <>Tạo mới dữ liệu <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
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

        {/* Status Update Warranty Modal */}
        <AnimatePresence>
          {statusUpdate.showModal && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={() => setStatusUpdate({ ...statusUpdate, showModal: false })}
              ></motion.div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative z-10"
              >
                <h3 className="text-xl font-black text-slate-900 mb-4">Bảo Hành Sau Sửa Chữa</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Vui lòng nhập thời gian bảo hành (tháng) cho thiết bị sau khi hoàn tất sửa chữa.
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Thời gian (Tháng)</label>
                    <input
                      type="number"
                      min="0"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 font-bold text-slate-900"
                      value={statusUpdate.duration}
                      onChange={(e) => setStatusUpdate({ ...statusUpdate, duration: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setStatusUpdate({ ...statusUpdate, showModal: false })}
                      className="flex-1 py-3 font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={confirmWarrantyUpdate}
                      className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-primary-500/30 transition-all"
                    >
                      Xác Nhận
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <ConfirmModal
          {...confirmConfig}
          onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        />

        {/* Print Receipt Modal */}
        <AnimatePresence>
          {printReceipt && (
            <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                onClick={() => setPrintReceipt(null)}
              ></motion.div>
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full relative z-10 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-black text-slate-900">Phiếu Nhận Hàng</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        // Open new window for printing
                        const printWindow = window.open('', '_blank', 'width=600,height=800');
                        const receiptHTML = `
                          <!DOCTYPE html>
                          <html>
                          <head>
                            <meta charset="UTF-8">
                            <title>Phiếu Nhận Hàng - ${printReceipt.code}</title>
                            <style>
                              @page {
                                size: A5 portrait;
                                margin: 8mm;
                              }
                              * {
                                margin: 0;
                                padding: 0;
                                box-sizing: border-box;
                              }
                              body {
                                font-family: Arial, sans-serif;
                                color: #000;
                                background: white;
                                width: 148mm;
                                min-height: 210mm;
                                padding: 8mm;
                                margin: 0 auto;
                              }
                              .receipt-header {
                                border-bottom: 2px solid #000;
                                padding-bottom: 6px;
                                margin-bottom: 10px;
                              }
                              .company-info h1 {
                                font-size: 12px;
                                font-weight: bold;
                                text-align: center;
                                margin: 0 0 3px 0;
                              }
                              .company-info p {
                                font-size: 9px;
                                text-align: center;
                                margin: 2px 0;
                              }
                              .receipt-title {
                                text-align: center;
                                margin-top: 8px;
                              }
                              .receipt-title h2 {
                                font-size: 14px;
                                font-weight: bold;
                                margin: 4px 0;
                              }
                              .receipt-code, .receipt-date {
                                font-size: 10px;
                                margin: 2px 0;
                              }
                              .section {
                                margin: 10px 0;
                              }
                              .section h3 {
                                font-size: 11px;
                                font-weight: bold;
                                border-bottom: 1px solid #ddd;
                                padding-bottom: 3px;
                                margin-bottom: 5px;
                              }
                              .info-table {
                                width: 100%;
                                border-collapse: collapse;
                                font-size: 10px;
                              }
                              .info-table td {
                                padding: 3px 4px;
                                vertical-align: top;
                              }
                              .info-table .label {
                                width: 35%;
                                font-weight: bold;
                              }
                              .info-table .value {
                                border-bottom: 1px dotted #ccc;
                              }
                              .status-text {
                                font-size: 10px;
                                margin: 4px 0;
                              }
                              .status-badge {
                                display: inline-block;
                                padding: 2px 6px;
                                background: #f0f0f0;
                                border-radius: 3px;
                                font-size: 9px;
                              }
                              .signature-section {
                                display: flex;
                                justify-content: space-between;
                                margin-top: 15px;
                              }
                              .signature-box {
                                width: 45%;
                                text-align: center;
                              }
                              .signature-title {
                                font-size: 10px;
                                font-weight: bold;
                                margin-bottom: 3px;
                              }
                              .signature-note {
                                font-size: 8px;
                                font-style: italic;
                                margin-bottom: 3px;
                              }
                              .signature-space {
                                height: 40px;
                                border-bottom: 1px solid #000;
                                margin-top: 25px;
                              }
                              .footer-note {
                                margin-top: 12px;
                                padding-top: 8px;
                                border-top: 1px dashed #ccc;
                                font-size: 8px;
                                font-style: italic;
                              }
                              .footer-note p {
                                margin: 2px 0;
                              }
                              @media print {
                                body {
                                  width: 100%;
                                  padding: 0;
                                }
                              }
                            </style>
                          </head>
                          <body>
                            <div class="receipt-header">
                              <div class="company-info">
                                <h1>CÔNG TY TNHH GIẢI PHÁP CÔNG NGHỆ THÀNH PHÁT</h1>
                                <p>MST: 0314763940</p>
                                <p>Địa chỉ: A60 Tô Ký, Phường Đông Hưng Thuận, TP.Hồ Chí Minh</p>
                                <p>Hotline: 0935.888.489 - 0967.049.018</p>
                              </div>
                              <div class="receipt-title">
                                <h2>PHIẾU NHẬN HÀNG SỬA CHỮA</h2>
                                <p class="receipt-code">Mã phiếu: <strong>${printReceipt.code}</strong></p>
                                <p class="receipt-date">Ngày: ${format(new Date(printReceipt.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                              </div>
                            </div>
                            
                            <div class="section">
                              <h3>THÔNG TIN KHÁCH HÀNG</h3>
                              <table class="info-table">
                                <tr>
                                  <td class="label">Họ và tên:</td>
                                  <td class="value">${printReceipt.customerName}</td>
                                </tr>
                                ${printReceipt.companyName ? `<tr><td class="label">Công ty:</td><td class="value">${printReceipt.companyName}</td></tr>` : ''}
                                <tr>
                                  <td class="label">Số điện thoại:</td>
                                  <td class="value">${printReceipt.phoneNumber}</td>
                                </tr>
                                ${printReceipt.email ? `<tr><td class="label">Email:</td><td class="value">${printReceipt.email}</td></tr>` : ''}
                                <tr>
                                  <td class="label">Địa chỉ:</td>
                                  <td class="value">${printReceipt.address || ''}</td>
                                </tr>
                              </table>
                            </div>
                            
                            <div class="section">
                              <h3>THÔNG TIN THIẾT BỊ</h3>
                              <table class="info-table">
                                <tr>
                                  <td class="label">Tên sản phẩm:</td>
                                  <td class="value">${printReceipt.productName}</td>
                                </tr>
                                <tr>
                                  <td class="label">Số Serial:</td>
                                  <td class="value">${printReceipt.serialNumber || 'Không có'}</td>
                                </tr>
                                <tr>
                                  <td class="label">Mô tả sự cố:</td>
                                  <td class="value">${printReceipt.issueDescription}</td>
                                </tr>
                              </table>
                            </div>
                            
                            <div class="section">
                              <h3>TRẠNG THÁI</h3>
                              <p class="status-text">
                                Trạng thái hiện tại: <strong class="status-badge">${{ pending: 'Chờ xử lý', contacted: 'Đã liên hệ', received: 'Đã nhận máy', in_progress: 'Đang sửa chữa', completed: 'Hoàn thành', cancelled: 'Đã hủy' }[printReceipt.status] || printReceipt.status
                          }</strong>
                              </p>
                            </div>
                            
                            <div class="signature-section">
                              <div class="signature-box">
                                <p class="signature-title">NGƯỜI GIAO</p>
                                <p class="signature-note">(Ký và ghi rõ họ tên)</p>
                                <div class="signature-space"></div>
                              </div>
                              <div class="signature-box">
                                <p class="signature-title">NGƯỜI NHẬN</p>
                                <p class="signature-note">(Ký và ghi rõ họ tên)</p>
                                <div class="signature-space"></div>
                              </div>
                            </div>
                            
                            <div class="footer-note">
                              <p>* Vui lòng giữ phiếu này để nhận lại thiết bị.</p>
                              <p>* Thời gian sửa chữa dự kiến: _____ ngày làm việc.</p>
                            </div>
                          </body>
                          </html>
                        `;
                        printWindow.document.write(receiptHTML);
                        printWindow.document.close();
                        printWindow.focus();
                        // Wait for content to render then print
                        setTimeout(() => {
                          printWindow.print();
                        }, 250);
                      }}
                      className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-xl flex items-center gap-2 transition-all"
                    >
                      <Printer size={16} /> In phiếu
                    </button>
                    <button
                      onClick={() => setPrintReceipt(null)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Receipt Preview */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <RepairReceiptPrint request={printReceipt} />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
