import { QRCodeSVG } from 'qrcode.react';

const BulkQRLabelPrint = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  // Build short activation URL
  const getActivationUrl = (id) => {
    const host = window.location.host;
    const protocol = host.includes('localhost') ? 'http' : 'https';
    return `${protocol}://${host}/activate/${id}`;
  };

  return (
    <div className="bulk-print-wrapper">
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .bulk-print-wrapper, .bulk-print-wrapper * {
            visibility: visible !important;
          }
          .bulk-print-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
            display: block !important;
            width: 61mm !important;
            background: white !important;
          }
          @page {
            size: 61mm 41mm;
            margin: 0;
          }
          .print-label-item {
            display: flex !important;
            flex-direction: row !important;
            break-after: page !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            border: none !important;
            margin: 0 !important;
            padding: 2mm 2.5mm !important;
            width: 61mm !important;
            height: 41mm !important;
            max-height: 41mm !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .print-label-item:last-child {
            break-after: auto !important;
            page-break-after: auto !important;
          }
        }

        .bulk-print-wrapper {
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: #f1f5f9;
          padding: 32px;
          align-items: center;
        }

        .print-label-item {
          width: 61mm;
          height: 41mm;
          padding: 2mm 2.5mm;
          background: white;
          display: flex;
          flex-direction: row;
          align-items: center;
          box-sizing: border-box;
          font-family: Arial, Helvetica, sans-serif;
          overflow: hidden;
          border: 1px solid #ccc;
        }

        .print-label-qr-section {
          flex: 0 0 22mm;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .print-label-qr-text {
          font-size: 4.5pt;
          font-weight: 700;
          color: #000;
          margin-top: 1mm;
          text-transform: uppercase;
          letter-spacing: 0;
          text-align: center;
          white-space: nowrap;
        }

        .print-label-info-section {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-left: 2.5mm;
          overflow: hidden;
          gap: 0.3mm;
        }

        .print-label-brand {
          font-size: 7pt;
          font-weight: 900;
          color: #000;
          margin: 0;
          letter-spacing: 0.3mm;
        }

        .print-label-product {
          font-size: 6pt;
          font-weight: 700;
          color: #000;
          margin: 0;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .print-label-sn {
          font-size: 5pt;
          font-weight: 700;
          color: #333;
          margin: 0.5mm 0 0 0;
        }

        .print-label-instruction {
          font-size: 4.5pt;
          color: #555;
          margin: 0.8mm 0 0 0;
          font-weight: 600;
          font-style: italic;
        }

        .print-label-contact {
          font-size: 4.5pt;
          color: #000;
          margin: 0;
          font-weight: 600;
          line-height: 1.5;
        }

        .print-label-website {
          font-size: 4.5pt;
          color: #000;
          margin: 0.5mm 0 0 0;
          font-weight: 700;
        }
      `}</style>

      {items.map((item, index) => (
        <div key={item._id || index} className="print-label-item">
          <div className="print-label-qr-section">
            <QRCodeSVG
              value={getActivationUrl(item._id)}
              size={72}
              level="L"
              includeMargin={false}
              fgColor="#000000"
              bgColor="#ffffff"
            />
            <p className="print-label-qr-text">Quét kích hoạt BH</p>
          </div>

          <div className="print-label-info-section">
            <p className="print-label-brand">SmartRetail®</p>
            <p className="print-label-product">{item.productName}</p>
            <p className="print-label-sn">S/N: {Array.isArray(item.serialNumber) ? item.serialNumber[0] : item.serialNumber}</p>
            <p className="print-label-instruction">Quét mã kích hoạt BH</p>
            <p className="print-label-contact">Hotline: 0935 888 489</p>
            <p className="print-label-contact">KT: 0909 045 663</p>
            <p className="print-label-website">smartretail.com.vn</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BulkQRLabelPrint;
