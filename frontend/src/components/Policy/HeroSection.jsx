import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = ({ data }) => {
  return (
    <div className="relative h-[60vh] min-h-[500px] w-full flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 hover:scale-105"
        style={{ backgroundImage: `url(${data.bgImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40" />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-white max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-tight">
            {data.title.split('&').map((text, i) => (
              <span key={i} className={i === 1 ? 'text-primary-400' : ''}>
                {i === 1 ? ' &' : ''} {text}
              </span>
            ))}
          </h1>
          <p className="text-lg text-slate-300 font-medium leading-relaxed">
            {data.subtitle}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            {data.cta.map((btn, idx) => (
              <Link 
                key={idx}
                to={btn.link}
                className={`px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                  btn.primary 
                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/20' 
                    : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20'
                }`}
              >
                {btn.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
