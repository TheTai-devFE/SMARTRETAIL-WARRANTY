import { format } from 'date-fns';

const RepairReceiptPrint = ({ request }) => {
    if (!request) return null;

    return (
        <div className="a5-receipt-print">
            <div className="receipt-page">
                {/* Header */}
                <div className="receipt-header">
                    <div className="company-info">
                        <h1>CÔNG TY TNHH GIẢI PHÁP CÔNG NGHỆ THÀNH PHÁT</h1>
                        <p>MST: 0314763940</p>
                        <p>Địa chỉ: A60 Tô Ký, Phường Đông Hưng Thuận, TP.Hồ Chí Minh </p>
                        <p>Hotline: 0935.888.489 - 0967.049.018</p>
                    </div>
                    <div className="receipt-title">
                        <h2>PHIẾU NHẬN HÀNG SỬA CHỮA</h2>
                        <p className="receipt-code">Mã phiếu: <strong>{request.code}</strong></p>
                        <p className="receipt-date">Ngày: {format(new Date(request.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                    </div>
                </div>

                {/* Customer Info */}
                <div className="section">
                    <h3>THÔNG TIN KHÁCH HÀNG</h3>
                    <table className="info-table">
                        <tbody>
                            <tr>
                                <td className="label">Họ và tên:</td>
                                <td className="value">{request.customerName}</td>
                            </tr>
                            {request.companyName && (
                                <tr>
                                    <td className="label">Công ty:</td>
                                    <td className="value">{request.companyName}</td>
                                </tr>
                            )}
                            <tr>
                                <td className="label">Số điện thoại:</td>
                                <td className="value">{request.phoneNumber}</td>
                            </tr>
                            {request.email && (
                                <tr>
                                    <td className="label">Email:</td>
                                    <td className="value">{request.email}</td>
                                </tr>
                            )}
                            <tr>
                                <td className="label">Địa chỉ:</td>
                                <td className="value">{request.address}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Product Info */}
                <div className="section">
                    <h3>THÔNG TIN THIẾT BỊ</h3>
                    <table className="info-table">
                        <tbody>
                            <tr>
                                <td className="label">Tên sản phẩm:</td>
                                <td className="value">{request.productName}</td>
                            </tr>
                            <tr>
                                <td className="label">Số Serial:</td>
                                <td className="value">{request.serialNumber || 'Không có'}</td>
                            </tr>
                            <tr>
                                <td className="label">Mô tả sự cố:</td>
                                <td className="value description">{request.issueDescription}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Status */}
                <div className="section">
                    <h3>TRẠNG THÁI</h3>
                    <p className="status-text">
                        Trạng thái hiện tại: <strong className="status-badge">{getStatusLabel(request.status)}</strong>
                    </p>
                </div>

                {/* Signature Section */}
                <div className="signature-section">
                    <div className="signature-box">
                        <p className="signature-title">NGƯỜI GIAO</p>
                        <p className="signature-note">(Ký và ghi rõ họ tên)</p>
                        <div className="signature-space"></div>
                    </div>
                    <div className="signature-box">
                        <p className="signature-title">NGƯỜI NHẬN</p>
                        <p className="signature-note">(Ký và ghi rõ họ tên)</p>
                        <div className="signature-space"></div>
                    </div>
                </div>

                {/* Footer Note */}
                <div className="footer-note">
                    <p>* Vui lòng giữ phiếu này để nhận lại thiết bị.</p>
                    <p>* Thời gian sửa chữa dự kiến: _____ ngày làm việc.</p>
                </div>
            </div>

            <style>{`
                .a5-receipt-print {
                    font-family: 'Arial', sans-serif;
                    color: #000;
                    background: white;
                    width: 100%;
                    max-width: 148mm;
                    margin: 0 auto;
                }

                .receipt-page {
                    width: 148mm;
                    min-height: 210mm;
                    margin: 0 auto;
                    background: white;
                    padding: 8mm;
                    box-sizing: border-box;
                }

                .receipt-header {
                    border-bottom: 2px solid #000;
                    padding-bottom: 6px;
                    margin-bottom: 10px;
                }

                .company-info h1 {
                    font-size: 12px;
                    font-weight: bold;
                    text-align: center;
                    margin: 0 0 3px 0;
                    line-height: 1.3;
                }

                .company-info p {
                    font-size: 9px;
                    text-align: center;
                    margin: 2px 0;
                    line-height: 1.3;
                }

                .receipt-title {
                    text-align: center;
                    margin-top: 8px;
                }

                .receipt-title h2 {
                    font-size: 14px;
                    font-weight: bold;
                    margin: 4px 0;
                    line-height: 1.3;
                }

                .receipt-code, .receipt-date {
                    font-size: 10px;
                    margin: 2px 0;
                    line-height: 1.3;
                }

                .section {
                    margin: 10px 0;
                    page-break-inside: avoid;
                }

                .section h3 {
                    font-size: 11px;
                    font-weight: bold;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 3px;
                    margin-bottom: 5px;
                    line-height: 1.3;
                }

                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10px;
                }

                .info-table td {
                    padding: 3px 4px;
                    vertical-align: top;
                    line-height: 1.4;
                }

                .info-table .label {
                    width: 35%;
                    font-weight: bold;
                }

                .info-table .value {
                    border-bottom: 1px dotted #ccc;
                }

                .info-table .value.description {
                    min-height: 30px;
                }

                .status-text {
                    font-size: 10px;
                    margin: 4px 0;
                    line-height: 1.4;
                }

                .status-badge {
                    display: inline-block;
                    padding: 2px 6px;
                    background: #f0f0f0;
                    border-radius: 3px;
                    font-size: 9px;
                }

                .signature-section {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 15px;
                    page-break-inside: avoid;
                }

                .signature-box {
                    width: 45%;
                    text-align: center;
                }

                .signature-title {
                    font-size: 10px;
                    font-weight: bold;
                    margin-bottom: 3px;
                    line-height: 1.3;
                }

                .signature-note {
                    font-size: 8px;
                    font-style: italic;
                    margin-bottom: 3px;
                    line-height: 1.3;
                }

                .signature-space {
                    height: 40px;
                    border-bottom: 1px solid #000;
                    margin-top: 25px;
                }

                .footer-note {
                    margin-top: 12px;
                    padding-top: 8px;
                    border-top: 1px dashed #ccc;
                    font-size: 8px;
                    font-style: italic;
                }

                .footer-note p {
                    margin: 2px 0;
                    line-height: 1.3;
                }
            `}</style>
        </div>
    );
};

// Helper function
function getStatusLabel(status) {
    const labels = {
        pending: 'Chờ xử lý',
        contacted: 'Đã liên hệ',
        received: 'Đã nhận máy',
        in_progress: 'Đang sửa chữa',
        completed: 'Hoàn thành',
        cancelled: 'Đã hủy'
    };
    return labels[status] || status;
}

export default RepairReceiptPrint;
