import { AlertCircle, Calendar, CheckCircle2, Clock, FileText, Wrench } from 'lucide-react';

const RepairInfoBlock = ({ repair }) => {
    const statusMap = {
        pending: { label: 'Chờ xử lý', color: 'text-yellow-600 bg-yellow-50 border-yellow-200', icon: Clock },
        contacted: { label: 'Đã liên hệ', color: 'text-cyan-600 bg-cyan-50 border-cyan-200', icon: CheckCircle2 },
        received: { label: 'Đã nhận máy', color: 'text-blue-600 bg-blue-50 border-blue-200', icon: CheckCircle2 },
        in_progress: { label: 'Đang sửa chữa', color: 'text-indigo-600 bg-indigo-50 border-indigo-200', icon: Wrench },
        completed: { label: 'Hoàn thành', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
        cancelled: { label: 'Hủy bỏ', color: 'text-rose-600 bg-rose-50 border-rose-200', icon: AlertCircle },
    };

    const status = statusMap[repair.status] || statusMap.pending;

    // Check for active warranty
    let displayStatus = status;
    let isWarrantyActive = false;

    if (repair.status === 'completed' && repair.warrantyEndDate) {
        const endDate = new Date(repair.warrantyEndDate);
        if (endDate > new Date()) {
            isWarrantyActive = true;
            displayStatus = {
                label: 'Đã Hoàn Thành',
                color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
                icon: CheckCircle2
            };
        } else {
            displayStatus = {
                label: 'Hết Hạn Bảo Hành',
                color: 'text-slate-500 bg-slate-50 border-slate-200',
                icon: AlertCircle
            };
        }
    }

    const StatusIcon = displayStatus.icon;

    return (
        <div className="space-y-6">
            {/* Info Grid with Modern Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="group bg-gradient-to-br from-white to-slate-50/50 p-5 rounded-2xl border border-slate-200/60 hover:border-primary-300 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-100 rounded-lg group-hover:scale-110 transition-transform">
                            <FileText size={18} className="text-primary-600" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mã Phiếu</p>
                    </div>
                    <p className="text-xl font-black text-slate-900 font-mono tracking-wide">{repair.code}</p>
                </div>

                <div className="group bg-gradient-to-br from-white to-slate-50/50 p-5 rounded-2xl border border-slate-200/60 hover:border-primary-300 transition-all hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-accent-100 rounded-lg group-hover:scale-110 transition-transform">
                            <Calendar size={18} className="text-accent-600" />
                        </div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ngày Gửi</p>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{new Date(repair.createdAt).toLocaleDateString('vi-VN')}</p>
                </div>
            </div>

            {/* Issue Description */}
            <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-200/60">
                <div className="flex items-center gap-2 mb-3">
                    <div className="p-2 bg-slate-200 rounded-lg">
                        <Wrench size={16} className="text-slate-600" />
                    </div>
                    <p className="text-sm font-bold text-slate-600 uppercase tracking-wider">Mô Tả Lỗi</p>
                </div>
                <p className="text-base font-medium text-slate-700 leading-relaxed italic">
                    "{repair.issueDescription}"
                </p>
            </div>

            {/* Status Card - Enhanced */}
            <div className={`relative overflow-hidden p-6 rounded-2xl border-2 ${displayStatus.color} backdrop-blur-sm transition-all hover:shadow-lg`}>
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity"></div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`p-4 rounded-2xl bg-white shadow-md`}>
                            <StatusIcon size={28} className={displayStatus.color.split(' ')[0]} />
                        </div>
                        <div>
                            <p className="text-xs font-bold opacity-70 uppercase tracking-wider mb-1">Trạng Thái Hiện Tại</p>
                            <p className={`text-2xl font-black ${displayStatus.color.split(' ')[0]} font-display`}>{displayStatus.label}</p>
                        </div>
                    </div>

                    {repair.status === 'completed' && repair.warrantyEndDate && (
                        <div className="md:ml-auto pl-6 border-l-2 border-current/20">
                            <p className="text-xs font-bold opacity-70 uppercase tracking-wider mb-1">Bảo Hành Đến</p>
                            <p className="text-xl font-black">{new Date(repair.warrantyEndDate).toLocaleDateString('vi-VN')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RepairInfoBlock;
