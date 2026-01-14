const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configure Transporter (Email Sender)
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to your SMTP provider
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendRepairConfirmation = async (requestData) => {
    try {
        const templatePath = path.join(__dirname, '../templates/repairRequestSuccess.html');
        let htmlContent = fs.readFileSync(templatePath, 'utf8');

        // Format date
        const date = new Date(requestData.createdAt).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Replace placeholders with actual data
        htmlContent = htmlContent.replace('{{customerName}}', requestData.customerName);
        htmlContent = htmlContent.replace(/{{code}}/g, requestData.code);
        htmlContent = htmlContent.replace('{{productName}}', requestData.productName);
        htmlContent = htmlContent.replace('{{phoneNumber}}', requestData.phoneNumber);
        htmlContent = htmlContent.replace('{{date}}', date);

        // New fields mapping
        htmlContent = htmlContent.replace('{{serialNumber}}', requestData.serialNumber || 'Không có');
        htmlContent = htmlContent.replace('{{companyName}}', requestData.companyName || 'Khách lẻ');
        htmlContent = htmlContent.replace('{{address}}', requestData.address);
        htmlContent = htmlContent.replace('{{issueDescription}}', requestData.issueDescription);

        const mailOptions = {
            from: '"Smart Retail Support" <' + process.env.EMAIL_USER + '>',
            to: requestData.email,
            subject: `Xác Nhận Yêu Cầu Sửa Chữa - ${requestData.code}`,
            html: htmlContent,
        };

        const info = await transporter.sendMail(mailOptions);

        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};

module.exports = {
    sendRepairConfirmation,
};
