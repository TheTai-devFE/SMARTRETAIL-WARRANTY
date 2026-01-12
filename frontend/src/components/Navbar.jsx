import { Search, ShieldCheck, Wrench } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import LOGO_DARK from '../assets/LOGO SR.png';
import LOGO_LIGHT from '../assets/logo-white.png';


const Navbar = ({ isDark = false }) => {
  const logo = isDark ? LOGO_LIGHT : LOGO_DARK;
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isDark
      ? 'bg-slate-900/50 backdrop-blur-md border-b border-white/10 text-white  mb-14 '
      : 'bg-white/80 backdrop-blur-md border-b border-slate-100 text-slate-800  mb-14 '
      }`}>
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-black text-2xl tracking-tighter group transition-transform active:scale-95">
          {/* <span className={isDark ? 'text-white' : 'text-slate-900'}>SMARTRETAIL</span>
           */}
          <img src={logo} alt="Smart Retail Logo" className="h-8 md:h-10 w-auto" />
        </Link>

        <div className="flex items-center gap-1 md:gap-3 font-bold text-xs md:text-sm uppercase tracking-widest">
          <Link
            to="/"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${isActive('/')
              ? 'bg-primary-100 text-primary-700'
              : 'hover:bg-black/5'
              }`}
            aria-label="Trang tra cứu bảo hành"
          >
            <Search size={18} className={isActive('/') ? 'text-primary-600' : 'text-primary-500'} />
            <span className="hidden sm:inline">Tra cứu</span>
          </Link>

          <Link
            to="/yeu-cau-sua-chua"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${isActive('/yeu-cau-sua-chua')
              ? 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 shadow-sm'
              : 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50'
              }`}
            aria-label="Yêu cầu dịch vụ sửa chữa"
          >
            <Wrench size={18} className={isActive('/yeu-cau-sua-chua') ? 'text-indigo-600' : 'text-indigo-500'} />
            <span className="hidden sm:inline">Sửa chữa</span>
          </Link>

          <Link
            to="/chinh-sach"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${isActive('/chinh-sach')
              ? 'bg-primary-100 text-primary-700'
              : 'hover:bg-black/5'
              }`}
            aria-label="Chính sách bảo hành"
          >
            <ShieldCheck size={18} className={isActive('/chinh-sach') ? 'text-primary-600' : 'text-primary-500'} />
            <span className="hidden sm:inline">Chính sách</span>
          </Link>
          <Link
            to="#"
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${isActive('/chinh-sach')
              ? 'bg-primary-100 text-primary-700'
              : 'hover:bg-black/5'
              }`}
            aria-label="Chính sách bảo hành"
          >
            <ShieldCheck size={18} className={isActive('/chinh-sach') ? 'text-primary-600' : 'text-primary-500'} />
            <span className="hidden sm:inline">Tài liệu </span>
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
