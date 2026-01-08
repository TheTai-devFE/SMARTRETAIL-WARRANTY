// Component để tạo logo tròn với background màu cho QR code
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

            // Draw blue background circle (inner)
            ctx.fillStyle = '#2563EB'; // Primary blue color
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();

            // Clip to circle for logo
            ctx.save();
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2 - 4, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();

            // Draw semi-transparent white overlay for logo contrast
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fill();

            // Draw logo in center (scaled down a bit)
            const logoSize = size * 0.6; // Logo chiếm 60% circle
            const logoOffset = (size - logoSize) / 2;
            ctx.drawImage(img, logoOffset, logoOffset, logoSize, logoSize);

            ctx.restore();

            resolve(canvas.toDataURL());
        };
        img.src = logoSrc;
    });
};
