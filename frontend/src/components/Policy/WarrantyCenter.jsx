import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const WarrantyCenter = () => {
    const centers = [
        {
            name: "Văn phòng HCM",
            address: "A60 Tô Ký, P. Đông Hưng Thuận, Quận 12, TP.HCM",
            mapLink: "https://maps.app.goo.gl/1bWKPcp3VFRxKZXv5",
            available: true
        },
        {
            name: "Văn phòng HN",
            address: "66 P. Hồng Đô, làng Phú Đô, Nam Từ Liêm, Hà Nội",
            mapLink: "https://maps.app.goo.gl/P5JDd2vH5dqm8sBX8",
            available: true
        },
        {
            name: "Văn phòng miền trung",
            address: "Coming soon",
            mapLink: null,
            available: false
        }
    ];

    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
        >
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                    Trung tâm <span className="text-primary-600">bảo hành</span>
                </h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Hệ thống trung tâm bảo hành trên toàn quốc
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {centers.map((center, idx) => (
                    <motion.a
                        key={idx}
                        href={center.available ? center.mapLink : undefined}
                        target={center.available ? '_blank' : undefined}
                        rel={center.available ? 'noopener noreferrer' : undefined}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className={`card-hover glass-card p-6 text-center group ${center.available ? 'cursor-pointer' : 'cursor-default opacity-60'
                            }`}
                    >
                        <div className="mb-4 inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 group-hover:scale-110 transition-transform">
                            <MapPin size={32} className="text-primary-600" />
                        </div>
                        <h3 className="text-lg font-black text-slate-900 mb-2">{center.name}</h3>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed">{center.address}</p>
                        {center.available ? (
                            <span className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 group-hover:gap-3 transition-all">
                                Xem bản đồ
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-400">
                                🚧 Coming Soon
                            </span>
                        )}
                    </motion.a>
                ))}
            </div>
        </motion.section>
    );
};

export default WarrantyCenter;
