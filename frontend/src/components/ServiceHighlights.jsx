import { motion } from 'framer-motion';

const ServiceHighlights = ({ delay = 0.3 }) => {
    const highlights = [
        { icon: '🔍', text: 'Tra cứu bảo hành' },
        { icon: '🔧', text: 'Sửa chữa thiết bị' },
        { icon: '⚡', text: 'Tiện lợi - Nhanh chóng' },
        { icon: '🏆', text: 'Dịch vụ chuyên nghiệp' },
        { icon: '👥', text: '8000+ KH & ĐL' },
        { icon: '🌏', text: 'Hỗ trợ toàn quốc' },
        { icon: '🛡️', text: 'An toàn, minh bạch' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="flex flex-wrap justify-center gap-3 pt-4"
            role="list"
            aria-label="Dịch vụ chính"
        >
            {highlights.map((service, idx) => (
                <motion.div
                    key={idx}
                    role="listitem"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: delay + idx * 0.05 }}
                    className="group flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:border-primary-300 transition-all hover:shadow-lg hover:scale-105"
                >
                    <span className="text-xl group-hover:scale-110 transition-transform">
                        {service.icon}
                    </span>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-primary-600 transition-colors">
                        {service.text}
                    </span>
                </motion.div>
            ))}
        </motion.div>
    );
};

export default ServiceHighlights;
