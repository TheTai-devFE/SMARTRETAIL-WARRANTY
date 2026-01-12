import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const WarrantyTabs = ({ data }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [showAll, setShowAll] = useState({});

  // Get current category items
  const currentCategory = data.categories[activeTab];
  const items = currentCategory?.items || [];
  const isExpanded = showAll[activeTab];
  const displayItems = isExpanded ? items : items.slice(0, 4);
  const hasMore = items.length > 4;

  // Reset showAll when changing tabs
  const handleTabChange = (tabIdx) => {
    setActiveTab(tabIdx);
  };

  const toggleShowAll = () => {
    setShowAll(prev => ({
      ...prev,
      [activeTab]: !prev[activeTab]
    }));
  };

  return (
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
          {data.categories.map((category, idx) => (
            <button
              key={category.id}
              onClick={() => handleTabChange(idx)}
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
          <AnimatePresence mode="wait">
            {displayItems.map((item, i) => (
              <motion.div
                key={`${activeTab}-${i}`}
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
          </AnimatePresence>
        </div>

        {/* Show More/Less Button */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={toggleShowAll}
              className="text-slate-600 hover:text-primary-600 font-bold py-3 px-6 transition-all flex items-center gap-2 group"
            >
              <span>{isExpanded ? 'Thu gọn' : `Hiển thị thêm (${items.length - 4})`}</span>
              {isExpanded ? (
                <ChevronUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
              ) : (
                <ChevronDown size={20} className="group-hover:translate-y-0.5 transition-transform" />
              )}
            </button>
          </div>
        )}
      </motion.div>
    </motion.section>
  );
};

export default WarrantyTabs;
