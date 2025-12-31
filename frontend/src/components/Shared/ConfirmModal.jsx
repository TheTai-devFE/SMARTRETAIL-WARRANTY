import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Xác nhận", cancelText = "Hủy", type = "danger" }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={onClose}
          ></motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl md:rounded-[32px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-slate-100"
          >
            <div className="p-8 pb-6">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl ${type === 'danger' ? 'bg-rose-50 text-rose-500' : 'bg-primary-50 text-primary-500'}`}>
                  <AlertCircle size={28} />
                </div>
                <button 
                  onClick={onClose} 
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight italic">
                {title}
              </h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">
                {message}
              </p>
            </div>
            
            <div className="px-8 py-6 bg-slate-50 flex gap-3">
              <button 
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={`flex-1 py-3.5 rounded-2xl font-black text-white text-[11px] uppercase tracking-widest transition-all shadow-lg ${
                  type === 'danger' 
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' 
                    : 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/20'
                }`}
              >
                {confirmText}
              </button>
              <button 
                onClick={onClose}
                className="px-8 py-3.5 rounded-2xl font-black text-slate-500 hover:bg-white border border-transparent hover:border-slate-200 transition-all text-[11px] uppercase tracking-widest"
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
