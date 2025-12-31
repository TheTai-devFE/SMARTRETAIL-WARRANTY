import { motion } from 'framer-motion';
import {
    Briefcase,
    Building,
    Calendar,
    CheckCircle,
    Fingerprint,
    Hash,
    Info,
    Key,
    Lock,
    MapPin,
    Package,
    Phone,
    ShieldCheck,
    Smartphone,
    Tags,
    User as UserIcon,
    Users
} from 'lucide-react';

const FormSectionHeader = ({ icon: Icon, title, subtitle, colorClass = "text-primary-600" }) => (
  <div className="md:col-span-2 mb-2">
    <div className="flex items-center gap-3">
      <div className={`p-2 rounded-xl bg-white shadow-sm border border-slate-100 ${colorClass}`}>
        <Icon size={20} />
      </div>
      <div>
        <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
          {title}
        </h3>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{subtitle}</p>
      </div>
    </div>
  </div>
);

const InputWrapper = ({ label, icon: Icon, children, required, fullWidth }) => (
  <div className={`space-y-1.5 ${fullWidth ? 'md:col-span-2' : ''}`}>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
      {Icon && <Icon size={12} className="text-slate-300" />}
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative group">
      {children}
    </div>
  </div>
);

const WarrantyForm = ({ formData, setFormData, editingId }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
      {/* Customer Info Section */}
      <FormSectionHeader 
        icon={UserIcon} 
        title="Thông tin khách hàng" 
        subtitle="Customer Information Details" 
      />

      <InputWrapper label="Loại hình khách hàng" icon={Tags} fullWidth>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: 'Retail', label: 'Bán lẻ', icon: UserIcon, desc: 'Individual' },
            { id: 'Dealer', label: 'Đại lý', icon: Users, desc: 'Distributor' },
            { id: 'Project', label: 'Dự án', icon: Briefcase, desc: 'Enterprise' }
          ].map((type) => (
            <button
              key={type.id}
              type="button"
              onClick={() => setFormData({...formData, customerType: type.id})}
              className={`p-4 rounded-3xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${
                formData.customerType === type.id 
                  ? 'border-primary-500 bg-primary-50/50 shadow-lg shadow-primary-500/10' 
                  : 'border-slate-100 bg-white hover:border-primary-200'
              }`}
            >
              <div className={`p-2 rounded-xl mb-3 inline-block transition-colors ${
                formData.customerType === type.id ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-500'
              }`}>
                <type.icon size={18} />
              </div>
              <p className={`text-xs font-black uppercase tracking-tight leading-none ${
                formData.customerType === type.id ? 'text-primary-700' : 'text-slate-600'
              }`}>
                {type.label}
              </p>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{type.desc}</p>
              
              {formData.customerType === type.id && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute right-3 top-3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                    <CheckCircle size={10} strokeWidth={4} />
                  </div>
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </InputWrapper>

      <InputWrapper label="Số điện thoại" icon={Phone} required>
        <input 
          required 
          type="text" 
          placeholder="09xx xxx xxx"
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all bg-white font-medium text-slate-800 placeholder:text-slate-300" 
          value={formData.customerPhone} 
          onChange={e => setFormData({...formData, customerPhone: e.target.value})} 
        />
      </InputWrapper>

      <InputWrapper label="Tên khách hàng / Công ty" icon={Building}>
        <input 
          type="text" 
          placeholder="SmartRetail hoặc Tên cá nhân..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all bg-white font-medium text-slate-800 placeholder:text-slate-300" 
          value={formData.companyName} 
          onChange={e => setFormData({...formData, companyName: e.target.value})} 
        />
      </InputWrapper>

      <InputWrapper label="Mã số thuế (nếu có)" icon={Fingerprint}>
        <input 
          type="text" 
          placeholder="Nhập MST công ty..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all bg-white font-medium text-slate-800 placeholder:text-slate-300 font-mono text-sm" 
          value={formData.taxCode} 
          onChange={e => setFormData({...formData, taxCode: e.target.value})} 
        />
      </InputWrapper>

      <InputWrapper label="Địa chỉ giao hàng" icon={MapPin} fullWidth>
        <input 
          type="text" 
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all bg-white font-medium text-slate-800 placeholder:text-slate-300" 
          placeholder="Nhập địa chỉ nhà, dự án,..." 
          value={formData.deliveryAddress} 
          onChange={e => setFormData({...formData, deliveryAddress: e.target.value})} 
        />
      </InputWrapper>

      {/* Product Info Section */}
      <div className="md:col-span-2 mt-4">
        <FormSectionHeader 
          icon={Package} 
          title="Thông tin sản phẩm & Bảo hành" 
          subtitle="Hardware & Warranty Specifications" 
        />
      </div>

      <InputWrapper label="Tên sản phẩm" icon={Smartphone} required>
        <input 
          required 
          type="text" 
          placeholder="Màn hình cảm ứng, Kiosk..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all bg-white font-medium text-slate-800 placeholder:text-slate-300" 
          value={formData.productName} 
          onChange={e => setFormData({...formData, productName: e.target.value})} 
        />
      </InputWrapper>

      <InputWrapper label="Mã Model" icon={Hash} required>
        <input 
          required 
          type="text" 
          placeholder="SR-K215, LCD-43..."
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all bg-white font-bold text-slate-800 placeholder:text-slate-300 font-mono text-sm uppercase" 
          value={formData.productCode} 
          onChange={e => setFormData({...formData, productCode: e.target.value})} 
        />
      </InputWrapper>

      <InputWrapper 
        label={`Danh sách Serial Number ${formData.customerType === 'Project' ? '(Mỗi dòng 1 mã)' : '(Một mã duy nhất)'}`} 
        icon={Hash} 
        required 
        fullWidth
      >
        <div className="relative">
          {formData.customerType === 'Project' ? (
            <textarea 
              required 
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-mono text-xs bg-slate-50/30" 
              placeholder="Paste hàng loạt serial vào đây..."
              value={formData.serialNumber} 
              onChange={e => setFormData({...formData, serialNumber: e.target.value})}
            />
          ) : (
            <input 
              required 
              type="text" 
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-mono bg-slate-50/30 font-bold" 
              placeholder="Nhập S/N sản phẩm..."
              value={formData.serialNumber} 
              onChange={e => setFormData({...formData, serialNumber: e.target.value})} 
            />
          )}
          {formData.customerType === 'Project' && (
             <div className="absolute right-3 bottom-3 hidden md:block">
               <span className="text-[9px] font-black bg-primary-600 text-white px-2 py-0.5 rounded-full shadow-lg shadow-primary-500/30">
                 COUNT: {formData.serialNumber.split('\n').filter(s => s.trim()).length}
               </span>
             </div>
          )}
        </div>
      </InputWrapper>

      <InputWrapper label="Ngày xuất kho" icon={Calendar}>
        <input 
          required 
          type="date" 
          className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-bold text-slate-600 bg-white" 
          value={formData.startDate} 
          onChange={e => setFormData({...formData, startDate: e.target.value})} 
        />
      </InputWrapper>

      {editingId && (
        <>
          <InputWrapper label="Trạng thái bảo hành" icon={ShieldCheck}>
            <select 
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all bg-white font-bold text-slate-700 appearance-none cursor-pointer"
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="Pending">Chờ kích hoạt (Pending)</option>
              <option value="Activated">Đang bảo hành (Activated)</option>
            </select>
          </InputWrapper>

          {formData.status === 'Activated' && (
            <InputWrapper label="Ngày kích hoạt bảo hành" icon={Calendar}>
              <input 
                type="date" 
                className="w-full px-4 py-3 rounded-2xl border border-emerald-200 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all font-bold text-emerald-600 bg-emerald-50/30" 
                value={formData.activationDate} 
                onChange={e => setFormData({...formData, activationDate: e.target.value})} 
              />
            </InputWrapper>
          )}
        </>
      )}

      <InputWrapper label="Thời hạn bảo hành (Tháng)" icon={ShieldCheck}>
        <div className="relative">
          <input 
            required 
            type="number" 
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-bold text-slate-700 bg-white" 
            value={formData.warrantyPeriod} 
            onChange={e => setFormData({...formData, warrantyPeriod: parseInt(e.target.value)})} 
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tháng</span>
        </div>
      </InputWrapper>

      {/* Software Info Section (v2.1) */}
      <div className="md:col-span-2 mt-8">
        <motion.div 
          initial={false}
          animate={{ backgroundColor: formData.hasSoftware ? 'rgba(16, 185, 129, 0.03)' : 'rgba(248, 250, 252, 0.5)' }}
          className={`p-6 rounded-[32px] border-2 transition-all duration-500 ${
            formData.hasSoftware ? 'border-emerald-500/20 shadow-xl shadow-emerald-500/5' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className={`p-2.5 rounded-2xl shadow-lg transition-all duration-500 ${
                formData.hasSoftware ? 'bg-emerald-500 text-white shadow-emerald-500/30 rotate-0' : 'bg-slate-200 text-slate-400 shadow-none -rotate-12'
              }`}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className={`text-sm font-black transition-colors uppercase tracking-tight ${formData.hasSoftware ? 'text-emerald-700' : 'text-slate-600'}`}>
                  Tích hợp Phần mềm
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 italic">Software License Integration Suite</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer group">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={formData.hasSoftware}
                onChange={(e) => setFormData({...formData, hasSoftware: e.target.checked})}
              />
              <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
            </label>
          </div>

          {formData.hasSoftware && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="md:col-span-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block flex items-center gap-1.5">
                   <Key size={12} className="text-emerald-500" /> Loại bản quyền
                 </label>
                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                   {['1_Year', '2_Years', '3_Years', 'Lifetime'].map((type) => (
                     <button
                       key={type}
                       type="button"
                       onClick={() => setFormData({...formData, licenseType: type})}
                       className={`py-3 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                         formData.licenseType === type 
                           ? 'bg-emerald-500 text-white border-emerald-500 shadow-xl shadow-emerald-500/20 scale-105' 
                           : 'bg-white text-slate-500 border-slate-100 hover:border-emerald-200 hover:bg-emerald-50/50'
                       }`}
                     >
                       {type.replace('_', ' ')}
                     </button>
                   ))}
                 </div>
              </div>

              <InputWrapper label="Player ID" icon={Package}>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all font-mono text-sm bg-white" 
                  placeholder="SR-PLAYER-XXXX"
                  value={formData.playerId} 
                  onChange={e => setFormData({...formData, playerId: e.target.value})} 
                />
              </InputWrapper>

              <InputWrapper label="Tải khoản login" icon={UserIcon} required={formData.hasSoftware}>
                <input 
                  type="text" 
                  required={formData.hasSoftware}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all font-medium bg-white" 
                  placeholder="admin@smartretail.com"
                  value={formData.softwareAccount} 
                  onChange={e => setFormData({...formData, softwareAccount: e.target.value})} 
                />
              </InputWrapper>

              <div className="md:col-span-2">
                <InputWrapper label="Mật khẩu bảo mật" icon={Lock} required={formData.hasSoftware}>
                  <input 
                    type="text" 
                    required={formData.hasSoftware}
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 transition-all font-mono bg-white" 
                    placeholder="••••••••"
                    value={formData.softwarePassword} 
                    onChange={e => setFormData({...formData, softwarePassword: e.target.value})} 
                  />
                </InputWrapper>
              </div>

              <div className="md:col-span-2">
                <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/10 flex gap-4 items-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                    <Info size={18} />
                  </div>
                  <p className="text-[10px] font-bold text-emerald-800 leading-relaxed uppercase tracking-tight">
                    Hệ thống sẽ tự động gán thiết bị đầu tiên làm <span className="underline decoration-emerald-500 decoration-2">Thiết bị chính (Master)</span> để quản lý License tập trung.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default WarrantyForm;
