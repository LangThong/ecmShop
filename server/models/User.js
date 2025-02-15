const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Chỉ bắt buộc nếu không phải người dùng Google
      },
    },
    googleId: { type: String },
    role: {
      type: String,
      default: "user",
    },
    phoneNumber: {
      type: String, // Kiểu chuỗi để lưu số điện thoại
      required: false, // Không bắt buộc
    },
    gender: {
      type: String, // Kiểu chuỗi để lưu giới tính
      enum: ["male", "female", "other", null], // Giới hạn các giá trị hợp lệ (có thể để trống)
      default: null, // Mặc định là null nếu không được cung cấp
    },
    image: {
      type: String, // Kiểu chuỗi để lưu đường dẫn hình ảnh
      default: "", // Giá trị mặc định là chuỗi rỗng
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
