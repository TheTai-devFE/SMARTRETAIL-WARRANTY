import { motion } from 'framer-motion';
import { CheckCircle, Clock, MapPin, MessageSquare, Package, PenTool, PhoneCall, ShieldCheck, Sparkles, Wrench, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { warrantyPolicyData as data } from '../data/warrantyPolicyData';

const PolicyPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen selection:bg-primary-100 selection:text-primary-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary-50/50 via-accent-50/30 to-transparent -z-10 blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-l from-accent-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation"></div>
      <div className="absolute bottom-40 left-0 w-96 h-96 bg-gradient-to-r from-primary-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation" style={{ animationDelay: '1s' }}></div>

      <Navbar isDark={false} />

      <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
        {/* Hero Section - Modern */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-accent-50 rounded-full border border-primary-200/50 mb-4">
            <ShieldCheck size={16} className="text-primary-600 animate-pulse" />
            <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">Chính sách bảo hành</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Thông Tin & <span className="gradient-text">Chính Sách</span>
            <br />
            <span className="text-3xl md:text-5xl text-slate-600 font-bold">Bảo Hành</span>
          </h1>

          <p className="text-slate-600 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Chúng tôi cam kết mang đến <strong>dịch vụ hậu mãi tốt nhất</strong>, đảm bảo quyền lợi và sự an tâm tuyệt đối cho khách hàng sử dụng <strong>sản phẩm chính hãng</strong> của SMARTRETAIL.
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

        {/* Warranty Coverage - Modern Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Phạm Vi <span className="text-primary-600">Bảo Hành</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Danh sách sản phẩm và thời hạn bảo hành áp dụng
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.coverage.categories.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className={`p-3 rounded-2xl ${idx === 0 ? 'bg-gradient-to-br from-blue-100 to-blue-200' :
                      idx === 1 ? 'bg-gradient-to-br from-purple-100 to-purple-200' :
                        'bg-gradient-to-br from-amber-100 to-amber-200'
                    }`}>
                    {idx === 0 ? <Package size={24} className="text-blue-600" /> :
                      idx === 1 ? <Wrench size={24} className="text-purple-600" /> :
                        <Sparkles size={24} className="text-amber-600" />}
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{category.label}</h3>
                </div>

                <div className="space-y-3">
                  {category.items.map((item, i) => (
                    <div key={i} className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 hover:border-primary-200 transition-all">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                        <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-xs font-black whitespace-nowrap">
                          {item.period}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{item.scope}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Policies - Modern Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Điều Khoản <span className="text-primary-600">Bảo Hành</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.policies.map((policy, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-6 hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-2xl ${idx === 0 ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' :
                      idx === 1 ? 'bg-gradient-to-br from-rose-100 to-rose-200' :
                        'bg-gradient-to-br from-indigo-100 to-indigo-200'
                    }`}>
                    {idx === 0 ? <CheckCircle size={24} className="text-emerald-600" /> :
                      idx === 1 ? <XCircle size={24} className="text-rose-600" /> :
                        <Clock size={24} className="text-indigo-600" />}
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{policy.title}</h3>
                </div>

                {policy.subtitle && (
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{policy.subtitle}</p>
                )}

                <ul className="space-y-2">
                  {policy.content.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${idx === 0 ? 'bg-emerald-500' :
                          idx === 1 ? 'bg-rose-500' :
                            'bg-indigo-500'
                        }`}></span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.section>

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
              Liên Hệ <span className="text-primary-600">Hỗ Trợ</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.support.map((item, idx) => {
              const icons = {
                PhoneCall: PhoneCall,
                MessageSquare: MessageSquare,
                MapPin: MapPin,
                PenTool: PenTool
              };
              const Icon = icons[item.icon];

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
                  <div className="mb-4 inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary-100 to-accent-100 group-hover:scale-110 transition-transform">
                    <Icon size={32} className="text-primary-600" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">{item.desc}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 group-hover:gap-3 transition-all">
                    {item.cta}
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </span>
                </motion.a>
              );
            })}
          </div>
        </motion.section>
      </div>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-2 font-black text-3xl tracking-tighter text-white opacity-20 filter grayscale">
              <span className="bg-white text-slate-900 px-2 py-0.5 rounded-lg">S</span>
              SMARTRETAIL
            </div>
            <p className="text-slate-500 text-sm font-medium">© 2024 SMARTRETAIL Warranty System. Bản quyền thuộc về SMARTRETAIL.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PolicyPage;
