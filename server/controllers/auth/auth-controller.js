const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const axios = require("axios");

//register
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;
  //   console.log(userName + "///" + email + "///" + password);
  try {
    const checkUser = await User.findOne({ email });
    if (checkUser)
      return res.json({
        success: false,
        message: "User Already exists with the same email! Please try again",
      });

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

//login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser)
      return res.json({
        success: false,
        message: "User doesn't exists! Please register first",
      });

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch)
      return res.json({
        success: false,
        message: "Incorrect password! Please try again",
      });

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
        gender: checkUser.gender,
        phoneNumber: checkUser.phoneNumber,
      },
      "CLIENT_SECRET_KEY",
      { expiresIn: "60m" }
    );

    res.cookie("token", token, { httpOnly: true, secure: false }).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
        gender: checkUser.gender,
        phoneNumber: checkUser.phoneNumber,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

const loginWithGoogle = async (req, res) => {
  const { token } = req.body;

  try {
    // Xác thực token và lấy thông tin người dùng từ Google
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { sub, name, email, picture } = response.data;

    let user = await User.findOne({ email: email });

    if (!user) {
      // Nếu người dùng chưa tồn tại, tạo mới người dùng
      user = new User({
        userName: name,
        email,
        googleId: sub,
      });
      await user.save();
    }

    // Tạo JWT token
    const token1 = jwt.sign(
      {
        id: user._id,
        role: user.role,
        email: user.email,
        userName: user.userName,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
      },
      "CLIENT_SECRET_KEY", // Nên lưu KEY này trong environment variable
      { expiresIn: "60m" }
    );

    // Cấu hình cookie và trả về phản hồi
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure cookie khi môi trường là production
    };

    res.cookie("token", token1, cookieOptions).json({
      success: true,
      message: "Logged in successfully",
      user: {
        email: user.email,
        role: user.role,
        id: user._id,
        userName: user.userName,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(400).send("Invalid Token");
  }
};

//logout

const logoutUser = (req, res) => {
  res.clearCookie("token").json({
    success: true,
    message: "Logged out successfully!",
  });
};

//auth middleware
const authMiddleware = async (req, res, next) => {
  // Lấy token từ cookie hoặc header
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; // Lấy từ header Authorization

  if (!token)
    return res.status(403).json({
      success: false,
      message: "Unauthorised user!",
    });

  try {
    const decoded = jwt.verify(token, "CLIENT_SECRET_KEY");
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(405).json({
      success: false,
      message: "Unauthorised user!",
    });
  }
};

const updateUser = async (req, res) => {
  const { email, userName, phoneNumber, gender } = req.body;
  const user = req.user; // Giả sử bạn đã xác thực người dùng và có `userId`

  try {
    const userDoc = await User.findById(user.id);
    console.log(user);

    if (!userDoc) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Cập nhật các trường cần thiết
    userDoc.email = email || userDoc.email;
    userDoc.userName = userName || userDoc.userName;
    userDoc.phoneNumber = phoneNumber || userDoc.phoneNumber;
    userDoc.gender = gender || userDoc.gender;

    // Lưu thay đổi
    await userDoc.save();

    res.status(200).json({
      success: true,
      user: {
        id: userDoc._id,
        email: userDoc.email,
        userName: userDoc.userName,
        phoneNumber: userDoc.phoneNumber,
        gender: userDoc.gender,
        role: userDoc.role,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  loginWithGoogle,
  updateUser,
};
