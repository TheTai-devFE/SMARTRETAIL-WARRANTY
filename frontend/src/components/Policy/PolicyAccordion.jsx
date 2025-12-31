import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const PolicyAccordion = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Chi Tiết Chính Sách</h2>
          <p className="text-slate-500 font-medium italic italic">Cập nhật mới nhất: 01/2024</p>
        </div>

        <div className="space-y-4">
          {data.map((item, idx) => (
            <div 
              key={idx} 
              className={`rounded-2xl overflow-hidden border transition-all ${
                activeIndex === idx 
                  ? 'border-primary-200 bg-white shadow-xl shadow-primary-500/5' 
                  : 'border-slate-200 bg-slate-50 hover:bg-white'
              }`}
            >
              <button
                onClick={() => setActiveIndex(activeIndex === idx ? -1 : idx)}
                className="w-full px-8 py-6 flex items-center justify-between text-left"
              >
                <span className={`text-lg font-black tracking-tight transition-colors ${activeIndex === idx ? 'text-primary-600' : 'text-slate-800'}`}>
                  {idx + 1}. {item.title}
                </span>
                <motion.div
                  animate={{ rotate: activeIndex === idx ? 180 : 0 }}
                  className={`${activeIndex === idx ? 'text-primary-500' : 'text-slate-400'}`}
                >
                  <ChevronDown size={24} strokeWidth={3} />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-8 pb-8 space-y-4 border-t border-slate-50 pt-6">
                      {item.content.map((point, pIdx) => (
                        <div key={pIdx} className="flex gap-4 items-start group">
                          <CheckCircle2 size={18} className="mt-1 text-primary-500 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
                          <p className="text-slate-600 font-medium leading-relaxed">{point}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PolicyAccordion;
