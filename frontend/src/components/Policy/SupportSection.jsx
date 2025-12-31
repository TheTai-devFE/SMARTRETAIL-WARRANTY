import { MapPin, MessageSquare, PhoneCall } from 'lucide-react';

const icons = { PhoneCall, MessageSquare, MapPin };

const SupportSection = ({ data }) => {
  return (
    <section id="support" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {data.map((item, idx) => {
            const Icon = icons[item.icon];
            return (
              <div 
                key={idx}
                className="group p-10 rounded-[2.5rem] bg-slate-900 text-white flex flex-col items-center text-center space-y-6 transition-all hover:translate-y-[-10px] hover:shadow-2xl hover:shadow-slate-900/40"
              >
                <div className="p-5 rounded-3xl bg-primary-600 text-white group-hover:scale-110 transition-transform duration-500">
                  <Icon size={32} strokeWidth={2.5} />
                </div>
                <div className="space-y-2 flex-grow">
                  <h3 className="text-2xl font-black tracking-tight">{item.title}</h3>
                  <p className="text-slate-400 font-medium">{item.desc}</p>
                </div>
                <button className="w-full py-4 rounded-2xl bg-white text-slate-900 font-black uppercase text-sm tracking-widest hover:bg-primary-500 hover:text-white transition-all transform active:scale-95">
                  {item.cta}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SupportSection;
