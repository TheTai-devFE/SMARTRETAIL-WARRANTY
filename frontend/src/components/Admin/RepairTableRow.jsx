import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';

const RepairTableRow = ({ request, onDelete, onUpdateStatus }) => {
    const statusColors = {
        pending: 'bg-yellow-100 text-yellow-700',
        contacted: 'bg-cyan-100 text-cyan-700',
        received: 'bg-blue-100 text-blue-700',
        in_progress: 'bg-indigo-100 text-indigo-700',
        completed: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700'
    };

    const statusLabels = {
        pending: 'Chờ xử lý',
        contacted: 'Đã liên hệ',
        received: 'Đã nhận máy',
        in_progress: 'Đang sửa',
        completed: 'Hoàn thành',
        cancelled: 'Hủy bỏ'
    };

    return (
        <tr className="hover:bg-slate-50 transition-colors group">
            <td className="px-6 py-4">
                <div className="w-10"></div> {/* Checkbox placeholder alignment */}
            </td>
            <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{request.productName}</div>
                <div className="flex flex-col gap-1 mt-1">
                    <span className="text-xs text-primary-600 font-bold font-mono bg-primary-50 px-2 py-0.5 rounded w-fit">{request.code}</span>
                    <span className="text-xs text-slate-500 font-mono">{request.serialNumber || 'No Serial'}</span>
                </div>
            </td>
            <td className="px-6 py-4">
                <div className="font-bold text-slate-900">{request.customerName}</div>
                <div className="text-sm text-slate-500">{request.phoneNumber}</div>
                <div className="text-xs text-slate-400 mt-1 max-w-[200px] truncate" title={request.address}>
                    {request.address}
                </div>
            </td>
            <td className="px-6 py-4">
                <p className="text-sm text-slate-600 max-w-[250px] line-clamp-2" title={request.issueDescription}>
                    {request.issueDescription}
                </p>
            </td>
            <td className="px-6 py-4">
                <div className="relative inline-block">
                    <select
                        value={request.status}
                        onChange={(e) => onUpdateStatus(request._id, e.target.value)}
                        className={`appearance-none pl-3 pr-8 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border-0 cursor-pointer focus:ring-2 focus:ring-primary-500 outline-none ${statusColors[request.status] || 'bg-slate-100'}`}
                    >
                        {Object.entries(statusLabels).map(([key, label]) => (
                            <option key={key} value={key}>{label}</option>
                        ))}
                    </select>
                </div>
            </td>
            <td className="px-6 py-4 text-xs font-bold text-slate-500 font-mono">
                {format(new Date(request.createdAt), 'dd/MM/yyyy')}
                {request.status === 'completed' && request.warrantyEndDate && (
                    <div className="mt-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                        BH đến: {format(new Date(request.warrantyEndDate), 'dd/MM/yyyy')}
                    </div>
                )}
            </td>
            <td className="px-6 py-4 text-center">
                <button
                    onClick={() => onDelete(request._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                    title="Xóa"
                >
                    <Trash2 size={16} />
                </button>
            </td>
        </tr>
    );
};

export default RepairTableRow;
