import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const SoftwareInfoCard = ({ softwareInfo, softwareStatus }) => {
  const [showPassword, setShowPassword] = useState(false);

  if (!softwareInfo) return null;

  return (
    <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tên phần mềm */}
        <div>
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Tên Phần Mềm</p>
          <p className="font-bold text-emerald-900">{softwareInfo.productName || '—'}</p>
        </div>

        {/* Loại License */}
        <div>
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Loại License</p>
          <p className="font-bold text-emerald-900">{softwareInfo.licenseType?.replace('_', ' ') || '—'}</p>
        </div>

        {/* Trạng thái */}
        <div>
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Trạng Thái</p>
          <div className="flex items-center gap-2">
            <p className={`font-bold ${softwareStatus?.swIsExpired ? 'text-rose-700' :
                softwareInfo.licenseStatus === 'Activated' ? 'text-emerald-700' : 'text-amber-700'
              }`}>
              {softwareStatus?.swStatusLabel || 'Chờ kích hoạt'}
            </p>
          </div>
        </div>

        {/* Số thiết bị */}
        {softwareInfo.deviceLimit && softwareInfo.deviceLimit > 1 && (
          <div>
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Số Thiết Bị</p>
            <p className="font-bold text-emerald-900">{softwareInfo.deviceLimit} thiết bị</p>
          </div>
        )}

        {/* Tài khoản */}
        {softwareInfo.softwareAccount && (
          <div>
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Tài Khoản</p>
            <p className="font-bold text-emerald-900 font-mono text-sm">{softwareInfo.softwareAccount}</p>
          </div>
        )}

        {/* Mật khẩu */}
        {softwareInfo.softwarePassword && (
          <div>
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Mật Khẩu</p>
            <div className="flex items-center gap-2">
              <p className="font-bold text-emerald-900 font-mono text-sm">
                {showPassword ? softwareInfo.softwarePassword : '••••••••••'}
              </p>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 hover:bg-emerald-100 rounded-lg transition-colors"
                title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={16} className="text-emerald-700" /> : <Eye size={16} className="text-emerald-700" />}
              </button>
            </div>
          </div>
        )}

        {/* Player ID */}
        {softwareInfo.playerId && (
          <div className="md:col-span-3">
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">Player ID</p>
            <p className="font-bold text-emerald-900 font-mono text-sm">{softwareInfo.playerId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SoftwareInfoCard;
