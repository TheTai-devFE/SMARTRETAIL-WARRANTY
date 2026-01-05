import { Edit2, Key, Trash2 } from 'lucide-react';
import { softwareApi } from '../../api';

const SoftwareTableRow = ({ software, isSelected, onToggleSelect, onEdit, onDelete }) => {

    const handleActivate = async () => {
        if (confirm('Kích hoạt license này ngay bây giờ?')) {
            try {
                await softwareApi.activate(software._id);
                alert('Đã kích hoạt!');
                window.location.reload(); // Simple reload for now
            } catch (e) {
                alert('Lỗi: ' + e.message);
            }
        }
    };

    return (
        <tr className={`hover:bg-indigo-50/30 transition-colors group border-b border-slate-50 last:border-0 ${isSelected ? 'bg-indigo-50/60' : ''}`}>
            <td className="px-6 py-4 align-top">
                <input
                    type="checkbox"
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mt-1"
                    checked={isSelected}
                    onChange={() => onToggleSelect(software._id)}
                />
            </td>
            <td className="px-6 py-4 align-top">
                <div className="flex flex-col">
                    <span className="font-bold text-slate-800 text-sm">{software.productName}</span>
                    <span className="text-xs text-slate-400 font-mono mt-0.5">{software.customerCode}</span>
                </div>
            </td>
            <td className="px-6 py-4 align-top">
                <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">{software.licenseType}</span>
            </td>
            <td className="px-6 py-4 align-top">
                <span className="font-bold text-sm text-primary-600">{software.deviceLimit || 1}</span>
            </td>
            <td className="px-6 py-4 align-top">
                <div className="flex flex-col">
                    <span className="font-bold text-slate-700 text-xs">{software.companyName || software.customerPhone}</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">{software.taxCode}</span>
                </div>
            </td>
            <td className="px-6 py-4 align-top">
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${software.licenseStatus === 'Activated'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                    }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${software.licenseStatus === 'Activated' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}></span>
                    {software.licenseStatus === 'Activated' ? 'Active' : 'Pending'}
                </div>
            </td>
            <td className="px-6 py-4 align-top">
                {software.endDate ? (
                    <span className="text-xs font-bold text-slate-600">{new Date(software.endDate).toLocaleDateString('vi-VN')}</span>
                ) : (
                    <span className="text-xs text-slate-400 italic">--/--/----</span>
                )}
            </td>
            <td className="px-6 py-4 align-top text-center">
                <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {software.licenseStatus !== 'Activated' && (
                        <button
                            onClick={handleActivate}
                            className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors"
                            title="Kích hoạt nhanh"
                        >
                            <Key size={16} />
                        </button>
                    )}
                    <button
                        onClick={() => onEdit(software)}
                        className="p-2 text-blue-500 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Sửa thông tin"
                    >
                        <Edit2 size={16} />
                    </button>
                    <button
                        onClick={() => onDelete(software._id)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                        title="Xóa bản ghi"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </td>
        </tr>
    );
};

export default SoftwareTableRow;
