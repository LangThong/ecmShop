/* eslint-disable no-undef */
const nodemailer = require("nodemailer");

// Tạo cấu hình SMTP
const transporter = nodemailer.createTransport({
  service: "gmail", // Hoặc một dịch vụ email khác
  auth: {
    user: "nguyenvanchifor@gmail.com", // Thay bằng email của bạn
    pass: "tnvv kzlw gayf fthy", // Mật khẩu email hoặc ứng dụng
  },
});

// Hàm gửi email
// app password: tnvv kzlw gayf fthy
const sendOrderConfirmationEmail = async (toEmail, orderDetails) => {
  try {
    const mailOptions = {
      from: "nguyenvanchifor@gmail.com", // Địa chỉ gửi
      to: toEmail, // Địa chỉ nhận
      subject: "Xác nhận đơn hàng",
      html: `
        <h1>Cảm ơn bạn đã đặt hàng!</h1>
        <p>Đơn hàng của bạn đã được xác nhận.</p>
        <h3>Chi tiết đơn hàng:</h3>
        <ul>
          ${
            orderDetails
              ? orderDetails
                  .map(
                    (item) =>
                      `<li>${item.title} - ${item.quantity} x ${item.price} VNĐ</li>`
                  )
                  .join("")
              : ""
          }
        </ul>
        <p>Tổng cộng: ${orderDetails?.reduce(
          (total, item) => total + item.quantity * item.price,
          0
        )} VNĐ</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email gửi thành công");
  } catch (error) {
    console.error("Lỗi khi gửi email:", error);
  }
};

module.exports = { sendOrderConfirmationEmail };
