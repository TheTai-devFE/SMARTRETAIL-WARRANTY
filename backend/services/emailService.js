const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

const sendRepairConfirmation = async (requestData) => {
    try {
        const apiKey = process.env.RESEND_API_KEY;

        // Kiểm tra API Key
        if (!apiKey || apiKey.includes('your_api_key_here')) {
            console.error('❌ RESEND_API_KEY chưa được cấu hình hoặc chưa chính xác trong .env');
            return false;
        }

        // Khởi tạo Resend bên trong hàm
        const resend = new Resend(apiKey);

        const templatePath = path.join(__dirname, '../templates/repairRequestSuccess.html');
        if (!fs.existsSync(templatePath)) {
            console.error('❌ Email template không tồn tại:', templatePath);
            return false;
        }

        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        // Format ngày tháng
        const date = new Date(requestData.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit', month: '2-digit', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });

        // Thay thế nội dung
        htmlContent = htmlContent.replace('{{customerName}}', requestData.customerName)
            .replace(/{{code}}/g, requestData.code)
            .replace('{{productName}}', requestData.productName)
            .replace('{{phoneNumber}}', requestData.phoneNumber)
            .replace('{{date}}', date)
            .replace('{{serialNumber}}', requestData.serialNumber || 'Không có')
            .replace('{{companyName}}', requestData.companyName || 'Khách lẻ')
            .replace('{{address}}', requestData.address)
            .replace('{{issueDescription}}', requestData.issueDescription);

        console.log('📧 Đang gửi email qua Resend API tới:', requestData.email);

        const { data, error } = await resend.emails.send({
            from: 'Smart Retail Support <onboarding@resend.dev>',
            to: requestData.email,
            subject: `Xác Nhận Yêu Cầu Sửa Chữa - ${requestData.code}`,
            html: htmlContent,
        });

        if (error) {
            console.error('❌ Lỗi Resend API:', error.message);
            return false;
        }

        console.log('✅ Gửi email thành công qua Resend. ID:', data.id);
        return true;
    } catch (error) {
        console.error('❌ Lỗi gửi email:', error.message);
        return false;
    }
};

module.exports = { sendRepairConfirmation };
