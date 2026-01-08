import { motion } from 'framer-motion';
import { MapPin, MessageSquare, PenTool, PhoneCall, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { warrantyPolicyData as data } from '../data/warrantyPolicyData';

const PolicyPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="bg-slate-50 min-h-screen selection:bg-primary-100 selection:text-primary-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary-50/50 via-accent-50/30 to-transparent -z-10 blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute top-40 right-0 w-96 h-96 bg-gradient-to-l from-accent-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation"></div>
      <div className="absolute bottom-40 left-0 w-96 h-96 bg-gradient-to-r from-primary-100/40 to-transparent -z-10 blur-3xl rounded-full float-animation" style={{ animationDelay: '1s' }}></div>

      <Navbar isDark={false} />

      <div className="container mx-auto px-4 py-12 md:py-20  max-w-6xl">
        {/* Hero Section - Modern */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 mt-16 sm:mt-8 space-y-6"
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

        {/* Warranty Coverage - Tab Layout */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Phạm Vi <span className="text-primary-600">Bảo Hành</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Danh sách sản phẩm và thời hạn bảo hành áp dụng
            </p>
          </div>

          {/* Tab Navigation - Dark Style */}
          <div className="bg-slate-800 rounded-t-2xl overflow-hidden">
            <div className="flex flex-wrap">
              {data.coverage.categories.map((category, idx) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 min-w-[200px] px-6 py-4 font-bold text-sm uppercase tracking-wide transition-all ${activeTab === idx
                    ? 'bg-primary-600 text-white border-b-4 border-primary-400'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content - Grid 4 columns */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-b-2xl border-2 border-slate-200 p-8"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.coverage.categories[activeTab].items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-lg transition-all"
                >
                  <h3 className="text-center font-bold text-slate-900 text-base mb-6 pb-4 border-b-2 border-slate-100">
                    {item.name}
                  </h3>

                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-xs text-slate-600 mb-2">Thời hạn bảo hành</p>
                      <p className="text-4xl font-black text-slate-900">
                        {item.period.split(' ')[0]}
                        <span className="text-sm font-normal text-slate-600 ml-1">
                          {item.period.split(' ')[1]}
                        </span>
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-xs text-slate-600 font-semibold mb-2">Loại dịch vụ bảo hành</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{item.scope}</p>
                    </div>

                    {item.coverage && (
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-600 font-semibold mb-2">Phạm vi bảo hành</p>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.coverage}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.section>

        {/* Policies - Document Style */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
              Chính sách bảo hành
            </h2>
          </div>

          {/* Single Document Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl border-2 border-slate-200 p-8 md:p-12 max-w-5xl mx-auto"
          >
            {/* Date */}
            <p className="text-sm text-slate-500 mb-6">
              Ngày hiệu lực: {new Date().toLocaleDateString('vi-VN')}
            </p>

            {/* Content Sections */}
            <div className="space-y-8">
              {data.policies.map((policy, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">
                    {policy.title}
                  </h3>

                  {policy.subtitle && (
                    <p className="text-sm text-slate-700 leading-relaxed mb-4">
                      {policy.subtitle}
                    </p>
                  )}

                  <div className="space-y-3">
                    {policy.content.map((item, i) => (
                      <p key={i} className="text-sm text-slate-700 leading-relaxed pl-4">
                        {item}
                      </p>
                    ))}
                  </div>

                  {/* Divider between sections except last */}
                  {idx < data.policies.length - 1 && (
                    <hr className="mt-8 border-slate-200" />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
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


    </div>
  );
};

export default PolicyPage;
