import { MapPin, MessageSquare, PenTool, PhoneCall } from 'lucide-react';
import { Link } from 'react-router-dom';

const icons = { PhoneCall, MessageSquare, MapPin, PenTool };

const SupportSection = ({ data }) => {
  return (
    <section id="support" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {data.map((item, idx) => {
            const Icon = icons[item.icon];
            const isInternal = item.link && item.link.startsWith('/');
            const Wrapper = isInternal ? Link : 'a';
            const wrapperProps = isInternal ? { to: item.link } : { href: item.link, target: "_blank", rel: "noopener noreferrer" };

            return (
              <div
                key={idx}
                className="group p-8 rounded-[2rem] bg-slate-900 text-white flex flex-col items-center text-center space-y-6 transition-all hover:translate-y-[-10px] hover:shadow-2xl hover:shadow-slate-900/40 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10 p-5 rounded-3xl bg-primary-600 text-white group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary-900/20">
                  <Icon size={32} strokeWidth={2.5} />
                </div>
                <div className="relative z-10 space-y-2 flex-grow">
                  <h3 className="text-xl font-black tracking-tight">{item.title}</h3>
                  <p className="text-slate-400 font-medium text-sm leading-relaxed">{item.desc}</p>
                </div>
                <Wrapper {...wrapperProps} className="relative z-10 w-full py-4 rounded-xl bg-white text-slate-900 font-black uppercase text-xs tracking-widest hover:bg-primary-500 hover:text-white transition-all transform active:scale-95 text-center flex items-center justify-center">
                  {item.cta}
                </Wrapper>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
