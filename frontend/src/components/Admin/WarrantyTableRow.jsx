import { format } from 'date-fns';
import { Edit2, ExternalLink, Package, QrCode, Trash2 } from 'lucide-react';

const WarrantyTableRow = ({
  warranty,
  onEdit,
  onDelete,
  onShowQR,
  isSelected,
  onToggleSelect
}) => {
  return (
    <tr className={`group hover:bg-slate-50/80 transition-all border-b border-slate-100 ${isSelected ? 'bg-primary-50/30' : ''}`}>
      <td className="px-6 py-4">
        <input
          type="checkbox"
          className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
          checked={isSelected}
          onChange={() => onToggleSelect(warranty._id)}
        />
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3 max-w-[280px]">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center text-primary-500 group-hover:scale-110 transition-transform shrink-0">
            <Package size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-slate-700 truncate" title={warranty.productName}>{warranty.productName}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{warranty.productCode}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="font-mono text-xs font-bold bg-primary-50 text-primary-700 px-2 py-1 rounded border border-primary-200 whitespace-nowrap">
          {warranty.customerCode || '—'}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1 max-w-[150px]">
          {Array.isArray(warranty.serialNumber) ? warranty.serialNumber.map((sn, i) => (
            <span key={i} className="font-mono text-[10px] font-bold bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 whitespace-nowrap">{sn}</span>
          )) : (
            <span className="font-mono text-xs font-bold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 whitespace-nowrap">{warranty.serialNumber}</span>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="max-w-[180px]">
          <p className="font-bold text-sm text-slate-700 truncate" title={warranty.companyName || 'Khách lẻ'}>{warranty.companyName || 'Khách lẻ'}</p>
          <p className="text-[10px] font-bold text-slate-400">{warranty.customerPhone}</p>
          <p className="text-[10px] font-bold text-slate-400 truncate mt-0.5" title={warranty.deliveryAddress}>{warranty.deliveryAddress}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${warranty.status === 'Activated' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
          }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${warranty.status === 'Activated' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
          {warranty.status === 'Activated' ? 'Active' : 'Pending'}
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="text-xs font-bold text-slate-600 whitespace-nowrap">
          {warranty.endDate ? format(new Date(warranty.endDate), 'dd/MM/yyyy') : '---'}
        </p>
        <p className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{warranty.warrantyPeriod} tháng</p>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => onShowQR(warranty)} className="p-2 hover:bg-white hover:text-primary-600 hover:shadow-md rounded-lg transition-all text-slate-400" title="Xem mã QR">
            <QrCode size={18} />
          </button>
          <button onClick={() => window.open(`/activate/${warranty._id}`, '_blank')} className="p-2 hover:bg-white hover:text-indigo-600 hover:shadow-md rounded-lg transition-all text-slate-400" title="Xem trang kích hoạt">
            <ExternalLink size={18} />
          </button>
          <button onClick={() => onEdit(warranty)} className="p-2 hover:bg-white hover:text-blue-600 hover:shadow-md rounded-lg transition-all text-slate-400" title="Sửa">
            <Edit2 size={18} />
          </button>
          <button onClick={() => onDelete(warranty._id)} className="p-2 hover:bg-white hover:text-rose-600 hover:shadow-md rounded-lg transition-all text-slate-400" title="Xóa">
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default WarrantyTableRow;
