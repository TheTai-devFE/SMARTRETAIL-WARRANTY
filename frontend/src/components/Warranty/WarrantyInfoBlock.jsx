import { format } from 'date-fns';
import { Building, Calendar, MapPin, Package } from 'lucide-react';

const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
  <div className={`flex items-start gap-4 ${className}`}>
    <div className="p-3 bg-primary-50 rounded-xl text-primary-600">
      <Icon size={24} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex flex-wrap gap-1">
        {value}
      </div>
    </div>
  </div>
);

const WarrantyInfoBlock = ({ warranty }) => {
  const serialNumbers = Array.isArray(warranty.serialNumber) ? warranty.serialNumber : [warranty.serialNumber];
  
  return (
    <div className="space-y-6 md:space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 py-6 md:py-8 border-y border-slate-100">
        <div className="space-y-6">
          <InfoItem 
            icon={Package} 
            label="Số Serial Sản Phẩm" 
            value={serialNumbers.map((sn, i) => (
              <span key={i} className="font-bold text-sm text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                {sn}
              </span>
            ))}
          />
          <InfoItem 
            icon={Calendar} 
            label="Ngày Xuất Kho" 
            value={<p className="font-bold text-xl text-slate-800">{format(new Date(warranty.startDate), 'dd/MM/yyyy')}</p>}
          />
        </div>
        
        <div className="space-y-6">
          <InfoItem 
            icon={Calendar} 
            label="Hạn Bảo Hành" 
            value={warranty.endDate ? (
              <p className="font-bold text-xl text-slate-800">{format(new Date(warranty.endDate), 'dd/MM/yyyy')}</p>
            ) : (
              <p className="font-bold text-xl text-slate-400 italic">Chưa kích hoạt ({warranty.warrantyPeriod} tháng)</p>
            )}
          />
          
          {warranty.status === 'Activated' && (
            <div className="bg-primary-600 p-5 rounded-2xl shadow-lg shadow-primary-500/20 text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[10px] font-black opacity-70 uppercase tracking-widest mb-1">Số Ngày Còn Lại</p>
                <p className="text-4xl font-black">{warranty.remainingDays} <span className="text-sm font-bold opacity-80 uppercase">ngày</span></p>
              </div>
              <Package className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-12" size={100} />
            </div>
          )}
        </div>
      </div>

      <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
        <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
          <Building size={16} className="text-primary-500" /> Thông tin sở hữu
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chủ sở hữu</p>
            <p className="font-bold text-slate-700">{warranty.companyName || 'Khách hàng cá nhân'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mã số thuế</p>
            <p className="font-bold text-slate-700">{warranty.taxCode || '—'}</p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Số điện thoại</p>
            <p className="font-bold text-slate-700">{warranty.customerPhone}</p>
          </div>
          {warranty.deliveryAddress && (
            <div className="md:col-span-2 lg:col-span-1">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Địa chỉ giao hàng</p>
              <p className="font-bold text-slate-700 text-xs leading-relaxed flex items-start gap-1.5 mt-1">
                <MapPin size={12} className="text-primary-400 shrink-0 mt-0.5" />
                {warranty.deliveryAddress}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WarrantyInfoBlock;
