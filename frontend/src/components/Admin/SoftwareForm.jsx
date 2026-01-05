
const SoftwareForm = ({ formData, setFormData, editingId }) => {
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="space-y-8">
            {/* Customer Info Section */}
            <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Thông tin Khách hàng
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Mã Khách Hàng (Tự động nếu trống)</label>
                        <input
                            type="text"
                            name="customerCode"
                            placeholder="KH..."
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-bold font-mono"
                            value={formData.customerCode || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Tên sản phẩm *</label>
                        <input
                            type="text"
                            name="productName"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-bold"
                            value={formData.productName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Tên Công ty / Khách hàng *</label>
                        <input
                            type="text"
                            name="companyName"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-medium"
                            value={formData.companyName || ''}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Mã số thuế *</label>
                        <input
                            type="text"
                            name="taxCode"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-mono font-medium"
                            value={formData.taxCode || ''}
                            onChange={handleChange}
                            title="Mã số thuế là bắt buộc"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Số điện thoại *</label>
                        <input
                            type="tel"
                            name="customerPhone"
                            required
                            pattern="[0-9]{10}"
                            maxLength="10"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-medium"
                            value={formData.customerPhone || ''}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                customerPhone: e.target.value.replace(/\D/g, '')
                            }))}
                            title="Số điện thoại phải đúng 10 số"
                        />
                    </div>
                </div>
            </div>

            {/* Software Info */}
            <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">
                    Chi tiết License
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Loại License</label>
                        <select
                            name="licenseType"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-medium bg-white"
                            value={formData.licenseType || '1_Year'}
                            onChange={handleChange}
                        >
                            <option value="1_Year">1 Năm</option>
                            <option value="2_Years">2 Năm</option>
                            <option value="3_Years">3 Năm</option>
                            <option value="Lifetime">Trọn đời</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Trạng thái</label>
                        <select
                            name="licenseStatus"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-medium bg-white"
                            value={formData.licenseStatus || 'Pending'}
                            onChange={handleChange}
                        >
                            <option value="Pending">Chờ kích hoạt</option>
                            <option value="Activated">Đã kích hoạt</option>
                            <option value="Expired">Hết hạn</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Software Account *</label>
                        <input
                            type="text"
                            name="softwareAccount"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-medium"
                            value={formData.softwareAccount || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Password *</label>
                        <input
                            type="text"
                            name="softwarePassword"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-medium"
                            value={formData.softwarePassword || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Player ID *</label>
                        <input
                            type="text"
                            name="playerId"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-medium"
                            value={formData.playerId || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Số lượng License (Tạo hàng loạt)</label>
                        <input
                            type="number"
                            name="deviceLimit"
                            min="1"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none font-bold text-primary-600"
                            placeholder="Mặc định: 1"
                            value={formData.deviceLimit || 1}
                            onChange={handleChange}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SoftwareForm;
