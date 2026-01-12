import { motion } from 'framer-motion';

const PolicyAccordion = ({ data }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-20"
    >
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
          Chính sách <span className="text-primary-600">bảo hành</span>
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
          {data.map((policy, idx) => (
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
              {idx < data.length - 1 && (
                <hr className="mt-8 border-slate-200" />
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.section>
  );
};

export default PolicyAccordion;
