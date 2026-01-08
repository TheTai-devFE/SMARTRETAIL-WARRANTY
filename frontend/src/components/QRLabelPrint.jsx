import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useState } from 'react';
import logo from '../assets/LOGO SR.png';
import { createRoundedLogoDataURL } from '../utils/qrLogo';

const QRLabelPrint = ({ activationUrl, productName }) => {
    const [roundedLogo, setRoundedLogo] = useState(null);

    useEffect(() => {
        createRoundedLogoDataURL(logo).then(setRoundedLogo);
    }, []);

    return (
        <div className="print-label-container">
            {/* Print Styles */}
            <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-label-container,
          .print-label-container * {
            visibility: visible;
          }
          .print-label-container {
            position: fixed !important;
            left: 0;
            top: 0;
            width: 100mm;
            height: 75mm;
          }
          @page {
            size: 100mm 75mm;
            margin: 0;
          }
        }
        
        .print-label {
          width: 100mm;
          height: 75mm;
          padding: 6mm;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          page-break-inside: avoid !important;
          page-break-after: avoid !important;
          page-break-before: avoid !important;
          overflow: hidden;
        }
        
        .print-label-product {
          font-size: 10pt;
          font-weight: 700;
          color: #000;
          margin: 0 0 3mm 0;
          text-align: center;
          line-height: 1.2;
          max-width: 90%;
        }
        
        .print-label-qr-container {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
      `}</style>

            <div className="print-label">
                {/* Product Name */}
                <p className="print-label-product">{productName}</p>

                {/* QR Code with Logo */}
                <div className="print-label-qr-container">
                    {roundedLogo && (
                        <QRCodeSVG
                            value={activationUrl}
                            size={100}
                            level="H"
                            includeMargin={false}
                            imageSettings={{
                                src: roundedLogo,
                                height: 40,
                                width: 40,
                                excavate: true,
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default QRLabelPrint;
