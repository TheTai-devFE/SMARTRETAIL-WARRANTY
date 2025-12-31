import { CheckCircle2, Clock, XCircle } from 'lucide-react';

const WarrantyStatusBadge = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'Activated':
        return {
          container: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
          icon: <CheckCircle2 size={20} className="stroke-[3]" />,
          label: 'Đang Bảo Hành'
        };
      case 'Pending':
        return {
          container: 'bg-amber-50 text-amber-600 border border-amber-100',
          icon: <Clock size={20} className="stroke-[3]" />,
          label: 'Chờ Kích Hoạt'
        };
      case 'Expired':
      default:
        return {
          container: 'bg-rose-50 text-rose-600 border border-rose-100',
          icon: <XCircle size={20} className="stroke-[3]" />,
          label: 'Hết Hạn Bảo Hành'
        };
    }
  };

  const { container, icon, label } = getStatusStyles();

  return (
    <div className={`px-6 py-3 rounded-2xl font-black flex items-center gap-3 text-sm shadow-sm ${container}`}>
      {icon}
      <span className="uppercase tracking-widest">{label}</span>
    </div>
  );
};

export default WarrantyStatusBadge;
