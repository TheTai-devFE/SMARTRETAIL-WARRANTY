import QRCode from 'qrcode';

/**
 * Generate QR labels and print them via a dedicated popup window.
 * This approach ensures:
 * 1. Zero CSS interference from the main app
 * 2. QR codes rendered as high-res PNG bitmaps (perfect for thermal printers)
 * 3. Exact page sizing for 61mm x 41mm (2.4" x 1.6") labels
 */
export const printLabels = async (items) => {
  if (!items || items.length === 0) return;

  const host = window.location.host;
  const protocol = host.includes('localhost') ? 'http' : 'https';

  // Generate all QR codes as high-resolution PNG data URLs
  const qrDataUrls = await Promise.all(
    items.map(item =>
      QRCode.toDataURL(`${protocol}://${host}/activate/${item._id}`, {
        width: 300,           // High-res bitmap for sharp thermal print
        margin: 0,            // No white border around QR
        errorCorrectionLevel: 'L',  // Low = largest dots = easiest to scan
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      })
    )
  );

  // Build labels HTML
  const labelsHtml = items.map((item, i) => {
    const sn = Array.isArray(item.serialNumber) ? item.serialNumber[0] : item.serialNumber;
    return `
      <div class="label">
        <div class="qr-side">
          <img src="${qrDataUrls[i]}" class="qr-img" />
          <div class="qr-caption">Quét kích hoạt BH</div>
        </div>
        <div class="info-side">
          <div class="brand">SmartRetail<sup>®</sup></div>
          <div class="product">${item.productName || ''}</div>
          <div class="sn">${sn || ''}</div>
          <div class="sep"></div>
          <div class="instruction">Quét mã kích hoạt Bảo hành</div>
          <div class="contact">Hotline: 0935 888 489</div>
          <div class="contact">KT: 0909 045 663</div>
          <div class="website">&#x1F310; smartretail.com.vn</div>
        </div>
      </div>
    `;
  }).join('');

  // Open a clean popup window for printing
  const printWindow = window.open('', 'LabelPrint', 'width=600,height=400');
  printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>In tem bảo hành</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  
  @page {
    size: 61mm 41mm;
    margin: 0;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: Arial, Helvetica, sans-serif;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .label {
    width: 61mm;
    height: 41mm;
    padding: 2mm;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    page-break-after: always;
    break-after: page;
  }
  .label:last-child {
    page-break-after: avoid;
    break-after: avoid;
  }

  .qr-side {
    width: 22mm;
    min-width: 22mm;
    max-width: 22mm;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-right: 1.5mm;
  }

  .qr-img {
    width: 20mm;
    height: 20mm;
    image-rendering: pixelated;
    image-rendering: -moz-crisp-edges;
    image-rendering: crisp-edges;
  }

  .qr-caption {
    font-size: 4pt;
    font-weight: 700;
    text-align: center;
    margin-top: 1mm;
    text-transform: uppercase;
    letter-spacing: 0;
    color: #000;
  }

  .info-side {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 1.5mm;
    border-left: 0.3mm solid #ccc;
    overflow: hidden;
    min-width: 0;
  }

  .brand {
    font-size: 7pt;
    font-weight: 900;
    color: #000;
    letter-spacing: 0.2mm;
    margin-bottom: 0.5mm;
  }
  .brand sup {
    font-size: 4pt;
  }

  .product {
    font-size: 5.5pt;
    font-weight: 700;
    color: #000;
    line-height: 1.2;
    max-height: 3.6em;
    overflow: hidden;
    margin-bottom: 0.3mm;
    word-break: break-word;
  }

  .sn {
    font-size: 5pt;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.5mm;
  }

  .sep {
    width: 100%;
    height: 0.2mm;
    background: #ccc;
    margin: 0.5mm 0;
  }

  .instruction {
    font-size: 4pt;
    color: #555;
    font-style: italic;
    margin-bottom: 0.3mm;
  }

  .contact {
    font-size: 4.5pt;
    color: #000;
    font-weight: 600;
    line-height: 1.4;
  }

  .website {
    font-size: 4pt;
    color: #000;
    font-weight: 700;
    margin-top: 0.5mm;
  }
</style>
</head>
<body>
${labelsHtml}
<script>
  // Wait for all QR images to fully load, then print
  Promise.all(
    Array.from(document.querySelectorAll('.qr-img')).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
    })
  ).then(() => {
    setTimeout(() => { window.print(); }, 200);
  });
</script>
</body>
</html>`);
  printWindow.document.close();
};
