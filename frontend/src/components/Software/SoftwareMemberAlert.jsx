import { Info } from 'lucide-react';

const SoftwareMemberAlert = ({ masterSerial }) => {
  return (
    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4">
      <div className="p-2.5 bg-amber-100 rounded-xl text-amber-600">
        <Info size={20} />
      </div>
      <div>
        <p className="text-amber-800 font-bold mb-1">Thông báo Bản quyền Phần mềm</p>
        <p className="text-amber-700/80 text-sm leading-relaxed">
          Phần mềm của thiết bị này được quản lý tập trung thông qua <b>Thiết bị chính</b>. 
          Vui lòng kiểm tra thông tin đăng nhập trên thiết bị có Số Serial: 
          <span className="ml-1 font-mono font-bold bg-amber-200/50 px-2 py-0.5 rounded text-amber-900 border border-amber-200">
             {masterSerial}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SoftwareMemberAlert;
