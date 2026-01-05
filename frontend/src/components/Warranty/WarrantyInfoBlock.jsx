import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Calendar, Fingerprint, MapPin, Package, ShieldCheck } from 'lucide-react';

const WarrantyInfoBlock = ({ warranty, compact = false }) => {
  const serialNumbers = Array.isArray(warranty.serialNumber) ? warranty.serialNumber : [warranty.serialNumber];

  return (
    <div className={`space-y-${compact ? '6' : '12'}`}>
      {/* Product Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Section: Details */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Serial Number */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Package size={16} className="stroke-[2]" />
                <p className="text-[10px] font-black uppercase tracking-[0.1em]">Số Serial</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {serialNumbers.map((sn, i) => (
                  <span key={i} className="text-xl md:text-2xl font-black text-slate-800 tracking-tighter">
                    {sn}
                  </span>
                ))}
              </div>
            </div>

            {/* Customer Code */}
            {warranty.customerCode && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <Fingerprint size={16} className="stroke-[2]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.1em]">Mã Khách Hàng</p>
                </div>
                <span className="text-xl md:text-2xl font-black text-primary-600 tracking-tighter font-mono">
                  {warranty.customerCode}
                </span>
              </div>
            )}

            {/* Dates */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={16} className="stroke-[2]" />
                <p className="text-[10px] font-black uppercase tracking-[0.1em]">Ngày Xuất Kho</p>
              </div>
              <p className="text-lg md:text-xl font-black text-slate-800 tracking-tighter">
                {format(new Date(warranty.startDate), 'dd/MM/yyyy')}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar size={16} className="stroke-[2]" />
                <p className="text-[10px] font-black uppercase tracking-[0.1em]">Hạn Bảo Hành</p>
              </div>
              {warranty.endDate ? (
                <p className="text-lg md:text-xl font-black text-slate-800 tracking-tighter">
                  {format(new Date(warranty.endDate), 'dd/MM/yyyy')}
                </p>
              ) : (
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-400 italic leading-none">Chờ kích hoạt</span>
                  <span className="text-[9px] font-black text-primary-500 uppercase tracking-widest mt-1">({warranty.warrantyPeriod} tháng)</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section: Status Card */}
        <div className="lg:col-span-5">
          {warranty.status === 'Activated' ? (
            <motion.div
              whileHover={{ y: -3 }}
              className="h-full bg-gradient-to-br from-primary-600 to-indigo-600 p-6 md:p-8 rounded-[32px] shadow-lg text-white relative overflow-hidden group min-h-[160px] flex flex-col justify-center"
            >
              <div className="relative z-10">
                <p className="text-[10px] font-black opacity-70 uppercase tracking-[0.2em] mb-2">Số ngày còn lại</p>
                <div className="flex items-baseline gap-3">
                  <span className="text-6xl md:text-7xl font-black tracking-tighter leading-none">{warranty.remainingDays}</span>
                  <span className="text-lg font-black uppercase opacity-80 tracking-widest">Ngày</span>
                </div>
              </div>
              <Package className="absolute right-[-5%] bottom-[-5%] opacity-10 rotate-12" size={140} />
            </motion.div>
          ) : (
            <div className="h-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[32px] flex items-center justify-center p-8 text-center min-h-[160px]">
              <div className="space-y-2">
                <ShieldCheck size={24} className="text-slate-300 mx-auto" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Sẵn sàng kích hoạt</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Owner Information Tray - Compact */}
      <div className="bg-[#F8FAFC] p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary-500"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-start">
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">Chủ sở hữu</p>
            <p className="text-sm md:text-base font-black text-slate-800 leading-tight">{warranty.companyName || 'Khách lẻ'}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">Mã số thuế</p>
            <p className="text-sm md:text-base font-black text-slate-800 leading-tight">{warranty.taxCode || '—'}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">Liên hệ</p>
            <p className="text-sm md:text-base font-black text-slate-800 leading-tight">{warranty.customerPhone}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em]">Địa chỉ</p>
            <div className="flex items-start gap-1.5">
              <MapPin size={12} className="text-primary-500 shrink-0 mt-0.5" />
              <p className="text-[11px] font-bold text-slate-600 leading-tight line-clamp-2">
                {warranty.deliveryAddress || '—'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarrantyInfoBlock;
