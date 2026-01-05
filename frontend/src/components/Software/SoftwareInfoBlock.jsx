import { format } from 'date-fns';
import { Calendar, Key, RefreshCcw, Shield, User } from 'lucide-react';

const InfoItem = ({ icon: Icon, label, value, className = "" }) => (
    <div className={`flex items-start gap-4 ${className}`}>
        <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <div className="flex flex-wrap gap-1 font-medium text-slate-700">
                {value}
            </div>
        </div>
    </div>
);

const SoftwareInfoBlock = ({ software }) => {
    return (
        <div className="space-y-6 md:space-y-8">
            <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100">
                <h3 className="font-black text-indigo-900 text-xs uppercase tracking-widest flex items-center gap-2 mb-6">
                    <Shield size={16} className="text-indigo-500" /> Thông tin Phần Mềm
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <InfoItem
                        icon={Key}
                        label="Loại Bản Quyền"
                        value={<span className="font-bold text-lg">{software.licenseType?.replace('_', ' ') || 'Standard'}</span>}
                    />

                    <InfoItem
                        icon={RefreshCcw}
                        label="Trạng Thái License"
                        value={
                            <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${software.licenseStatus === 'Activated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                {software.licenseStatus === 'Activated' ? 'Đã kích hoạt' : 'Chờ kích hoạt'}
                            </span>
                        }
                    />

                    <InfoItem
                        icon={User}
                        label="Tài Khoản"
                        value={software.softwareAccount || '---'}
                    />

                    <InfoItem
                        icon={Calendar}
                        label="Ngày Hết Hạn"
                        value={software.endDate ? format(new Date(software.endDate), 'dd/MM/yyyy') : '---'}
                    />
                </div>
            </div>

            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest flex items-center gap-2 mb-4">
                    <User size={16} className="text-primary-500" /> Thông tin sở hữu
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Chủ sở hữu</p>
                        <p className="font-bold text-slate-700">{software.companyName || 'Khách hàng cá nhân'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mã số thuế</p>
                        <p className="font-bold text-slate-700">{software.taxCode || '—'}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Số điện thoại</p>
                        <p className="font-bold text-slate-700">{software.customerPhone}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mã Khách Hàng</p>
                        <p className="font-bold text-slate-700">{software.customerCode || '—'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoftwareInfoBlock;
