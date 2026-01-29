import { motion } from 'framer-motion';
import { MapPin, MessageSquare, PenTool, PhoneCall, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PolicyAccordion from '../components/Policy/PolicyAccordion';
import WarrantyCenter from '../components/Policy/WarrantyCenter';
import WarrantyTabs from '../components/Policy/WarrantyTabs';
import { warrantyPolicyData as data } from '../data/warrantyPolicyData';

const PolicyPage = () => {

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-primary-100 selection:text-primary-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-linear-to-b from-primary-50/50 via-accent-50/30 to-transparent -z-10 blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-0 w-96 h-96 bg-linear-to-l from-accent-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation"></div>
      <div className="absolute bottom-40 left-0 w-96 h-96 bg-linear-to-r from-primary-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation" style={{ animationDelay: '1s' }}></div>

      <Navbar isDark={false} />

      <div className="container mx-auto px-4 py-12 md:py-20  max-w-6xl">
        {/* Hero Section - Modern */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 mt-16 sm:mt-8 space-y-6"
        >
          {/* <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 rounded-full border border-primary-200/50 mb-4">
            <ShieldCheck size={16} className="text-primary-600 animate-pulse" />
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">Chính sách bảo hành</span>
          </div> */}

          <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight mb-6">
            CHÍNH SÁCH <span className="gradient-text">BẢO HÀNH</span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            <strong>Công ty TNHH Giải Pháp Công Nghệ Thành Phát - MST: 0314763940</strong>, chúng tôi cung cấp dịch vụ bảo hành cho tất cả sản phẩm, được công bố và phân phối chính thức trên thị trường. Vui lòng liên hệ với chúng tôi nếu bạn cần hỗ trợ.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/"
              className="gradient-button px-8 py-4 text-white font-bold rounded-2xl shadow-xl shadow-primary-500/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              <ShieldCheck size={20} />
              Kiểm tra bảo hành
            </Link>
            <a
              href="#support"
              className="px-8 py-4 bg-white text-slate-700 font-bold rounded-2xl border-2 border-slate-200 hover:border-primary-300 transition-all hover:shadow-lg flex items-center gap-2"
            >
              <MapPin size={20} />
              Trung tâm hỗ trợ
            </a>
          </div>
        </motion.header>

        {/* Warranty Coverage - Component */}
        <WarrantyTabs data={data.coverage} />

        {/* Policies - Component */}
        <PolicyAccordion data={data.policies} />

        {/* Support Section - Modern Grid */}
        <motion.section
          id="support"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Thông tin <span className="text-primary-600">liên hệ</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.support.map((item, idx) => {
              const icons = {
                PhoneCall: PhoneCall,
                MessageSquare: MessageSquare,
                MapPin: MapPin,
                PenTool: PenTool
              };
              const Icon = icons[item.icon];

              // Nếu có contacts array (format mới)
              if (item.contacts) {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="card-hover glass-card p-6 text-center group"
                  >
                    <div className="mb-4 inline-flex p-4 rounded-2xl bg-linear-to-br from-primary-100 to-accent-100 group-hover:scale-110 transition-transform">
                      <Icon size={32} className="text-primary-600" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-4">{item.title}</h3>
                    <div className="space-y-2">
                      {item.contacts.map((contact, i) => (
                        <a
                          key={i}
                          href={contact.link}
                          target={contact.link.startsWith('http') ? '_blank' : undefined}
                          rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="block text-sm text-slate-600 hover:text-primary-600 font-semibold transition-colors"
                        >
                          {contact.label}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                );
              }

              // Format cũ (desc/link)
              return (
                <motion.a
                  key={idx}
                  href={item.link}
                  target={item.link.startsWith('http') ? '_blank' : undefined}
                  rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="card-hover glass-card p-6 text-center group cursor-pointer"
                >
                  <div className="mb-4 inline-flex p-4 rounded-2xl bg-linear-to-br from-primary-100 to-accent-100 group-hover:scale-110 transition-transform">
                    <Icon size={32} className="text-primary-600" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                  {Array.isArray(item.desc) ? (
                    <div className="text-sm text-slate-600 mb-4 leading-relaxed">
                      {item.desc.map((line, i) => (
                        <p key={i} className="font-semibold">{line}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 mb-4 leading-relaxed">{item.desc}</p>
                  )}
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 group-hover:gap-3 transition-all">
                    {item.cta}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </motion.a>
              );
            })}
          </div>
        </motion.section>

        {/* Warranty Center Component */}
        <WarrantyCenter />
      </div >


    </div >
  );
};

export default PolicyPage;
