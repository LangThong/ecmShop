const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Lấy danh sách người dùng
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

//lay 1 nguoi dung detail
const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "user detail not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

// Thêm người dùng mới
// const addUser = async (req, res) => {
//   try {
//     const { username, email, role, password } = req.body;
//     const newUser = new User({ username, email, password, role });
//     await newUser.save();
//     res.status(201).json({ success: true, data: newUser });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Some error occurred!" });
//   }
// };

// Xóa người dùng
const removeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
    res.status(200).json({ success: true, data: deletedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // userId từ params (hoặc req.body nếu sử dụng post)
    const { userName, email, password, role } = req.body;
    // console.log(userName + "//" + email + "//" + role + "//" + id);

    // Kiểm tra các lỗi từ express-validator (nếu có)
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }

    // Kiểm tra xem user có tồn tại trong DB không
    const user = await User.findById(id);

    if (!user) {
      return res
        .status(405)
        .json({ success: false, message: "User not found" });
    }

    // Cập nhật thông tin người dùng
    if (userName) user.userName = userName;
    if (email) user.email = email;
    if (role) user.role = role;

    // Nếu có mật khẩu mới, mã hóa mật khẩu trước khi lưu
    if (password) {
      const salt = await bcrypt.genSalt(10); // Tạo salt
      user.password = await bcrypt.hash(password, salt); // Mã hóa mật khẩu
    }

    // Lưu người dùng sau khi cập nhật
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const createUser = async (req, res) => {
  // Kiểm tra lỗi xác thực dữ liệu

  try {
    const { userName, email, password, role } = req.body;
    console.log(userName + "//" + email + "//" + role + "//" + password);

    // Kiểm tra xem email hoặc userName đã tồn tại chưa
    const existingUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email hoặc tên người dùng đã tồn tại",
      });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 12);

    // Tạo người dùng mới
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      role: role || "user", // Giá trị mặc định là "user"
    });

    // Lưu người dùng vào cơ sở dữ liệu
    await newUser.save();

    res.status(201).json({
      message: "Người dùng đã được tạo thành công",
      user: newUser,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", success: false });
  }
};

module.exports = { getUsers, createUser, removeUser, getUser, updateUser };
