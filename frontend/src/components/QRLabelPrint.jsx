import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import logoHeader from '../assets/logo.jpg';
import { createRoundedLogoDataURL } from '../utils/qrLogo';
const QRLabelPrint = ({ activationUrl, productName }) => {
  const [roundedLogo, setRoundedLogo] = useState(null);

  useEffect(() => {
    createRoundedLogoDataURL(logoHeader).then(setRoundedLogo);
  }, []);

  return (
    <div className="print-label-container">
      {/* Print Styles */}
      <style>{`
        @media print {
          /* Hide everything on the page */
          body * {
            visibility: hidden !important;
          }
          
          /* Show the parent wrapper when printing */
          .print-only-label {
            display: block !important;
            visibility: visible !important;
          }
          
          /* Show the label container and all its children */
          .print-label-container,
          .print-label-container * {
            visibility: visible !important;
          }
          
          .print-label-container {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 58mm !important;
            height: 40mm !important;
            z-index: 99999 !important;
            background: white !important;
          }
          
          .print-label {
            width: 58mm !important;
            height: 40mm !important;
            border: none !important;
          }
          
          @page {
            size: 58mm 40mm;
            margin: 0;
          }
        }
        
        /* Screen preview styles */
        .print-label-container {
          display: block;
        }
        
        .print-label {
          width: 58mm;
          height: 40mm;
          padding: 2mm;
          background: white;
          display: flex;
          flex-direction: row;
          align-items: stretch;
          justify-content: flex-start;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          page-break-inside: avoid !important;
          page-break-after: avoid !important;
          page-break-before: avoid !important;
          overflow: hidden;
          border: 0.3mm solid #e0e0e0;
        }
        
        .print-label-qr-section {
          width: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1mm;
          border-right: 0.2mm dashed #ddd;
        }
        
        .print-label-info-section {
          width: 50%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1mm 1mm 1mm 2mm;
          overflow: hidden;
        }
        
        .print-label-logo {
          height: 6mm;
          width: auto;
          object-fit: contain;
          align-self: flex-start;
        }
        
        .print-label-divider {
          width: 100%;
          height: 0.3mm;
          background: linear-gradient(90deg, #4361ee, #7209b7);
          border-radius: 1mm;
          margin: 1mm 0;
        }
        
        .print-label-product {
          font-size: 6pt;
          font-weight: 700;
          color: #1a1a2e;
          margin: 0;
          line-height: 1.2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .print-label-instruction {
          font-size: 5pt;
          color: #666;
          margin: 0;
          font-style: italic;
          margin-top: 1mm;
        }
        
        .print-label-footer {
          display: flex;
          align-items: center;
          gap: 1mm;
          margin-top: auto;
        }
        
        .print-label-icon {
          width: 2.5mm;
          height: 2.5mm;
        }
        
        .print-label-website {
          font-size: 5pt;
          color: #4361ee;
          margin: 0;
          font-weight: 500;
        }
      `}</style>

      <div className="print-label">
        {/* QR Code Section - Left Column (50%) */}
        <div className="print-label-qr-section">
          <QRCodeSVG
            value={activationUrl}
            size={75}
            level="H"
            includeMargin={false}
            imageSettings={roundedLogo ? {
              src: roundedLogo,
              height: 18,
              width: 18,
              excavate: true,
            } : undefined}
          />
        </div>

        {/* Info Section - Right Column (50%) */}
        <div className="print-label-info-section">
          {/* Logo thay thế text */}
          <img src={logoHeader} alt="Smart Retail" className="print-label-logo rounded-full" />

          <div className="print-label-divider"></div>

          <p className="print-label-product">{productName}</p>

          <p className="print-label-instruction">Quét mã để kích hoạt bảo hành</p>

          <p className="print-label-instruction">Hotline: 0935 888 489</p>
          <p className="print-label-instruction">Hỗ trợ kỹ thuật: 0909 045 663</p>

          <div className="print-label-footer">
            <svg className="print-label-icon" viewBox="0 0 24 24" fill="#4361ee">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            <p className="print-label-website">smartretail.com.vn</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRLabelPrint;

