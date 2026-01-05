import { Search, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import LOGO_DARK from '../assets/LOGO SR.png';
import LOGO_LIGHT from '../assets/logo-white.png';


const Navbar = ({ isDark = false }) => {
  const logo = isDark ? LOGO_LIGHT : LOGO_DARK;
  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isDark
      ? 'bg-slate-900/50 backdrop-blur-md border-b border-white/10 text-white  mb-14 '
      : 'bg-white/80 backdrop-blur-md border-b border-slate-100 text-slate-800  mb-14 '
      }`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter group transition-transform active:scale-95">
          {/* <span className={isDark ? 'text-white' : 'text-slate-900'}>SMARTRETAIL</span>
           */}
          <img src={logo} alt="Logo" className="h-8 md:h-10 w-auto" />
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
