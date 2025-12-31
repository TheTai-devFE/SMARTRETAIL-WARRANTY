import { Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ isDark = false }) => {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
      isDark 
        ? 'bg-slate-900/50 backdrop-blur-md border-b border-white/10 text-white' 
        : 'bg-white/80 backdrop-blur-md border-b border-slate-100 text-slate-800'
    }`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter group transition-transform active:scale-95">
          <span className="bg-primary-600 text-white px-2 py-0.5 rounded-lg shadow-lg shadow-primary-500/20">S</span>
          <span className={isDark ? 'text-white' : 'text-slate-900'}>SMARTRETAIL</span>
        </Link>

        <div className="flex items-center gap-1 md:gap-6 font-bold text-xs md:text-sm uppercase tracking-widest">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 transition-colors">
            <Search size={18} className="text-primary-500" />
            <span className="hidden sm:inline">Tra cứu</span>
          </Link>
          <Link to="/chinh-sach" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-black/5 transition-colors">
            <ShieldCheck size={18} className="text-primary-500" />
            <span className="hidden sm:inline">Chính sách</span>
          </Link>
          {/* <Link to="/admin" className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-all border border-slate-200 ml-2">
            <LayoutDashboard size={18} />
            <span className="hidden sm:inline">Quản trị</span>
          </Link> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
