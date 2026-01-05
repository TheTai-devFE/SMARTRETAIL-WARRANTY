import { AlertCircle } from 'lucide-react';

const SoftwareMemberAlert = ({ masterSerial }) => {
  return (
    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 flex items-start gap-4">
      <div className="p-3 bg-amber-100 rounded-xl text-amber-600 shrink-0">
        <AlertCircle size={24} />
      </div>
      <div>
        <h4 className="text-amber-900 font-black text-base mb-2">Thông báo Bản quyền Phần mềm</h4>
        <p className="text-amber-800 text-sm leading-relaxed">
          Phần mềm của thiết bị này được quản lý tập trung thông qua <b>Thiết bị chính</b>.
          Vui lòng kiểm tra thông tin đăng nhập trên thiết bị có Số Serial:{' '}
          <span className="ml-1 font-mono font-black bg-amber-200 px-3 py-1 rounded text-amber-900 border border-amber-300 inline-block">
            {masterSerial}
          </span>
        </p>
      </div>
    </div>
  );
};

export default SoftwareMemberAlert;
