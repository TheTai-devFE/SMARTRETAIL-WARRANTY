import { format } from 'date-fns';
import { Calendar, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const SoftwareInfoCard = ({ softwareInfo, softwareStatus }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!softwareInfo) return null;

  return (
    <div className="relative group overflow-hidden rounded-3xl md:rounded-[40px] bg-slate-900/95 backdrop-blur-2xl p-6 md:p-10 text-white shadow-2xl border border-white/10">
      {/* Decorative background element */}
      <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all"></div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest opacity-80">Player ID</p>
          <p className="font-bold text-lg font-mono tracking-tight">{softwareInfo.playerId || '---'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest opacity-80">Loại bản quyền</p>
          <div className="flex items-center gap-3">
            <p className="font-bold text-lg">{softwareInfo.licenseType?.replace('_', ' ')}</p>
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
              softwareStatus?.swIsExpired ? 'bg-rose-500/20 text-rose-400' :
              softwareInfo.licenseStatus === 'Activated' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              <div className={`w-1 h-1 rounded-full ${
                softwareStatus?.swIsExpired ? 'bg-rose-400' :
                softwareInfo.licenseStatus === 'Activated' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}></div>
              {softwareStatus?.swStatusLabel}
            </div>
          </div>
          {softwareInfo.licenseStatus === 'Activated' && softwareInfo.licenseType !== 'Lifetime' && !softwareStatus?.swIsExpired && (
            <p className="text-[10px] font-bold text-emerald-400/60 mt-1 flex items-center gap-1">
               <span className="w-1 h-1 rounded-full bg-emerald-400/40"></span>
               Còn {softwareStatus?.swRemainingDays} ngày
            </p>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest opacity-80">Tài khoản quản lý</p>
          <p className="font-mono text-base font-bold select-all break-all">{softwareInfo.softwareAccount || '---'}</p>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest opacity-80">Mật khẩu</p>
          <div className="flex items-center justify-between gap-2 bg-white/5 rounded-xl px-3 py-1 border border-white/5">
            <p className="font-mono text-base font-bold tracking-widest truncate">
              {showPassword ? softwareInfo.softwarePassword : '••••••••••••'}
            </p>
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors shrink-0"
              title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        
        {softwareInfo.softwareEndDate && (
          <div className="md:col-span-2 pt-4 border-t border-white/10 mt-2">
            <div className="flex items-center gap-2 text-emerald-400/60 text-[10px] font-black uppercase tracking-widest">
              <Calendar size={12} />
              <span>Thời hạn bản quyền đến: <b className="text-emerald-400">{format(new Date(softwareInfo.softwareEndDate), 'dd/MM/yyyy')}</b></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftwareInfoCard;
