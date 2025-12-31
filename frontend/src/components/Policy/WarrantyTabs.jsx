import { AnimatePresence, motion } from 'framer-motion';
import { Clock, Settings, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const WarrantyTabs = ({ data }) => {
  const [activeTab, setActiveTab] = useState(data.categories[0].id);

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Phạm Vi Bảo Hành</h2>
          <div className="h-1.5 w-20 bg-primary-600 mx-auto rounded-full"></div>
        </div>

        {/* Custom Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 p-1.5 bg-slate-100 rounded-2xl w-fit mx-auto">
          {data.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`px-8 py-3 rounded-xl font-bold text-sm transition-all ${
                activeTab === cat.id 
                  ? 'bg-white text-primary-600 shadow-md scale-105' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
            {data.categories.find(c => c.id === activeTab).items.map((item, idx) => (
              <motion.div
                key={`${activeTab}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-slate-50 rounded-3xl p-8 border border-slate-100 hover:border-primary-200 hover:bg-white transition-all hover:shadow-2xl hover:shadow-primary-500/5"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white rounded-2xl text-primary-600 shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-colors duration-500">
                      <Settings size={28} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">SMARTRETAIL CARE</span>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1">{item.name}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.scope}</p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <Clock className="text-primary-500" size={20} />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Thời hạn</p>
                        <p className="text-xl font-black text-primary-600 leading-none">{item.period}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="text-primary-500" size={20} />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dịch vụ</p>
                        <p className="font-bold text-slate-700">{item.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default WarrantyTabs;
