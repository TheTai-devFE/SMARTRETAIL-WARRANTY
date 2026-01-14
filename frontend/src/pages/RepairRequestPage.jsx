import { motion } from 'framer-motion';
import { CheckCircle, Loader2, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { repairApi } from '../api/index';
import Navbar from '../components/Navbar';
import ServiceHighlights from '../components/ServiceHighlights';

const RepairRequestPage = () => {
    const [formData, setFormData] = useState({
        customerName: '',
        companyName: '',
        phoneNumber: '',
        email: '',
        address: '',
        productName: '',
        serialNumber: '',
        issueDescription: '',
        images: []
    });
    const [previewImages, setPreviewImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);

    // SEO: Update document title
    useEffect(() => {
        document.title = 'Dịch Vụ Sửa Chữa Thiết Bị Chuyên Nghiệp | Smart Retail';
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Gửi yêu cầu sửa chữa thiết bị công nghệ nhanh chóng. Đội ngũ kỹ thuật chuyên nghiệp, quy trình sửa chữa minh bạch, bảo hành sau sửa chữa.');
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.images.length > 5) {
            toast.error('Chỉ được upload tối đa 5 ảnh');
            return;
        }

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewImages(prev => [...prev, ...newPreviews]);

        // Update state
        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...files]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {

            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'images') {
                    formData.images.forEach(image => {
                        data.append('images', image);
                    });
                } else {
                    data.append(key, formData[key]);
                }
            });


            const res = await repairApi.create(data);
            setSubmittedData(res.data); // Save the response including the code
            setSubmitted(true);
            toast.success('Gửi yêu cầu thành công!');
        } catch (error) {
            toast.error('Có lỗi xảy ra, vui lòng thử lại.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (submittedData) {
        return (
            <div className="bg-slate-50 min-h-screen font-sans">
                <Navbar isDark={false} />
                <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center max-w-2xl">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 text-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-500/20"
                    >
                        <CheckCircle size={48} />
                    </motion.div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-2">Đã Gửi Yêu Cầu!</h2>
                    <div className="bg-white p-6 rounded-2xl border-2 border-primary-200 shadow-xl shadow-primary-500/10 mb-6 w-full max-w-sm mx-auto">
                        <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Mã Tra Cứu Của Bạn</p>
                        <div className="text-3xl font-black text-primary-600 tracking-wider font-mono bg-gradient-to-br from-primary-50 to-accent-50 py-3 rounded-xl border-2 border-dashed border-primary-300">
                            {submittedData.code}
                        </div>
                        <p className="text-xs text-rose-500 font-bold mt-3">* Vui lòng lưu lại mã này để tra cứu trạng thái sửa chữa.</p>
                    </div>
                    <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                        Cảm ơn bạn đã liên hệ. Đội ngũ kỹ thuật của chúng tôi sẽ xem xét yêu cầu và liên hệ lại với bạn trong thời gian sớm nhất.
                    </p>
                    <div className="flex gap-4 flex-wrap justify-center">
                        <Link to="/" className="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-300 transition-all hover:shadow-md">
                            Về Trang Chủ
                        </Link>
                        <button
                            onClick={() => {
                                setSubmittedData(null);
                                setSubmitted(false);
                                setFormData({ customerName: '', companyName: '', phoneNumber: '', email: '', address: '', productName: '', serialNumber: '', issueDescription: '', images: [] });
                                setPreviewImages([]);
                            }}
                            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105"
                        >
                            Gửi yêu cầu khác
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 min-h-screen font-sans selection:bg-primary-100 selection:text-primary-900 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-indigo-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation"></div>
            <div className="absolute bottom-40 left-0 w-96 h-96 bg-gradient-to-r from-purple-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation" style={{ animationDelay: '1s' }}></div>

            <Navbar isDark={false} />

            <div className="container mx-auto px-4 py-12 md:py-24 max-w-4xl">
                {/* Hero Section - SEO Optimized */}
                <header className="text-center mb-12 mt-16 sm:mt-8">
                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 font-semibold text-sm mb-6 border border-indigo-200/50"
                    >
                        <Wrench size={16} className="animate-pulse" />
                        <span>Dịch Vụ Sửa Chữa Chuyên Nghiệp</span>
                    </motion.div> */}

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight leading-tight"
                    >
                        GỬI YÊU CẦU <span className="gradient-text">SỬA CHỮA</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed"
                    >
                        Vui lòng cung cấp theo thông tin bên dưới. Đội ngũ kỹ thuật của <strong>Công ty TNHH Giải Pháp Công Nghệ Thành Phát - MST:0314763940</strong>, sẽ hỗ trợ bạn nhanh nhất có thể.
                    </motion.p>

                    {/* Service Features */}
                    <ServiceHighlights delay={0.3} />
                </header>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onSubmit={handleSubmit}
                    className="glass-card p-8 md:p-12"
                    role="form"
                    aria-label="Biểu mẫu yêu cầu sửa chữa"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 text-white flex items-center justify-center text-sm font-black shadow-lg">1</span>
                                Thông tin liên hệ
                            </h2>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên *</label>
                                <input required name="customerName" value={formData.customerName} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all bg-white/50"
                                    placeholder="Nhập họ tên của bạn" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tên công ty (Nếu có)</label>
                                <input name="companyName" value={formData.companyName} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all bg-white/50"
                                    placeholder="Ví dụ: Công ty TNHH ABC" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại *</label>
                                <input required name="phoneNumber" value={formData.phoneNumber} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all bg-white/50"
                                    placeholder="Nhập số điện thoại" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all bg-white/50"
                                    placeholder="example@email.com (Để nhận thông báo)" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Địa chỉ *</label>
                                <textarea required name="address" value={formData.address} onChange={handleChange}
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all resize-none bg-white/50"
                                    placeholder="Nhập địa chỉ của bạn" />
                            </div>
                        </section>

                        <section className="space-y-6">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-sm font-black shadow-lg">2</span>
                                Thông tin sản phẩm
                            </h2>

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Tên sản phẩm *</label>
                                <input required name="productName" value={formData.productName} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-white/50"
                                    placeholder="Ví dụ: Màn hình quảng cáo 55 inch" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Số Serial (Nếu có)</label>
                                <input name="serialNumber" value={formData.serialNumber} onChange={handleChange}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all bg-white/50"
                                    placeholder="Nhập số serial thiết bị" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Hình ảnh sản phẩm (Tối đa 5 ảnh)</label>
                                <div className="flex flex-wrap gap-4 mb-2">
                                    {previewImages.map((img, index) => (
                                        <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                            <img src={img} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <label className="w-20 h-20 flex items-center justify-center border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-indigo-500 hover:bg-slate-50 transition-colors">
                                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                                        <span className="text-2xl text-slate-400">+</span>
                                    </label>
                                </div>
                                <p className="text-xs text-slate-500">Hỗ trợ JPG, PNG, WEBP.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Mô tả sự cố *</label>
                                <textarea required name="issueDescription" value={formData.issueDescription} onChange={handleChange}
                                    rows="5"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none bg-white/50"
                                    placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..." />
                            </div>
                        </section>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-slate-200">
                        <button type="submit" disabled={loading}
                            className="gradient-button flex items-center gap-2 px-8 py-4 text-white font-bold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary-600/20 hover:shadow-2xl hover:scale-105"
                            aria-label="Gửi yêu cầu sửa chữa"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                            {loading ? 'Đang Gửi...' : 'Gửi yêu cầu'}
                        </button>
                    </div>
                </motion.form>
            </div>


        </div>
    );
};

export default RepairRequestPage;
