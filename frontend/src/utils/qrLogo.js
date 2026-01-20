// Component để tạo logo tròn với background trắng cho QR code
export const createRoundedLogoDataURL = (logoSrc) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const size = 1000; // Size lớn để quality tốt
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            // Draw white background circle
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();

            // Clip to circle for logo
            ctx.save();
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Draw logo in center (scaled to fit nicely)
            const logoSize = size * 0.75; // Logo chiếm 75% circle
            const logoOffset = (size - logoSize) / 2;
            ctx.drawImage(img, logoOffset, logoOffset, logoSize, logoSize);

            ctx.restore();

            resolve(canvas.toDataURL());
        };
        img.src = logoSrc;
    });
};

// Convert image to base64 data URL (simple, no transformation)
export const convertImageToBase64 = (imageSrc) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL('image/png'));
        };
        img.onerror = () => {
            resolve(imageSrc); // Fallback to original src if error
        };
        img.src = imageSrc;
    });
};
