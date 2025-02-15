const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");

const getAllOrdersOfAllUsers = async (req, res) => {
  //   try {
  //     const orders = await Order.find({});

  //     if (!orders.length) {
  //       return res.status(404).json({
  //         success: false,
  //         message: "No orders found!",
  //       });
  //     }

  //     res.status(200).json({
  //       success: true,
  //       data: orders,
  //     });
  //   } catch (e) {
  //     console.log(e);
  //     res.status(500).json({
  //       success: false,
  //       message: "Some error occured!",
  //     });
  //   }
  try {
    // Use aggregate with proper ObjectId conversion
    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "users", // Ensure this matches your actual users collection name
          let: { userId: { $toObjectId: "$userId" } }, // Convert userId to ObjectId
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
              },
            },
            {
              $project: {
                userName: 1,
                _id: 0, // Exclude _id to prevent conflicts
              },
            },
          ],
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          userId: 1,
          userName: "$userDetails.userName",
          cartItems: 1,
          addressInfo: 1,
          orderStatus: 1,
          paymentMethod: 1,
          paymentStatus: 1,
          totalAmount: 1,
          orderDate: 1,
          orderUpdateDate: 1,
        },
      },
    ]);

    // Check if no orders found
    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found",
      });
    }

    // Return successful response
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching orders",
      error: error.message,
    });
  }
};

const getOrderDetailsForAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    await Order.findByIdAndUpdate(id, { orderStatus });

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getRevenue = async (req, res) => {
  try {
    const { month, year } = req.query;
    let filter = {}; // Lọc các đơn hàng đã hoàn thành orderStatus: "completed"

    // Kiểm tra nếu chỉ có `year` (thống kê theo tháng trong năm) hoặc cả `month` và `year` (thống kê theo ngày trong tháng)
    if (year) {
      if (month) {
        // Lọc doanh thu theo từng ngày trong tháng
        filter.orderDate = {
          $gte: new Date(year, month - 1, 1),
          $lt: new Date(year, month, 1),
        };

        // Nhóm theo ngày
        const dailyRevenue = await Order.aggregate([
          { $match: filter },
          {
            $group: {
              _id: { $dayOfMonth: "$orderDate" },
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
          { $sort: { _id: 1 } }, // Sắp xếp theo ngày
        ]);

        return res.status(200).json({ dailyRevenue });
      } else {
        // Lọc doanh thu theo từng tháng trong năm
        filter.orderDate = {
          $gte: new Date(year, 0, 1),
          $lt: new Date(parseInt(year) + 1, 0, 1),
        };

        // Nhóm theo tháng
        const monthlyRevenue = await Order.aggregate([
          { $match: filter },
          {
            $group: {
              _id: { $month: "$orderDate" },
              totalRevenue: { $sum: "$totalAmount" },
            },
          },
          { $sort: { _id: 1 } }, // Sắp xếp theo tháng
        ]);

        return res.status(200).json({ monthlyRevenue });
      }
    } else {
      return res
        .status(400)
        .json({ error: "Vui lòng cung cấp year hoặc month và year" });
    }
  } catch (error) {
    console.error("Lỗi khi lấy thống kê doanh thu:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

const getBrandOfOrder = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Nếu không có năm, mặc định là năm hiện tại
    const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();

    let startDate, endDate;

    if (month) {
      // Nếu có tháng, thống kê theo tháng
      const targetMonth = parseInt(month, 10) - 1; // JavaScript dùng chỉ số tháng từ 0-11
      startDate = new Date(targetYear, targetMonth, 1);
      endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
    } else {
      // Nếu không có tháng, thống kê cả năm
      startDate = new Date(targetYear, 0, 1);
      endDate = new Date(targetYear, 11, 31, 23, 59, 59);
    }

    // Lấy tất cả các đơn hàng trong khoảng thời gian đã chọn
    const orders = await Order.find({
      orderDate: { $gte: startDate, $lte: endDate },
    });

    if (!orders.length) {
      return res.json({
        message: "No orders found for the selected time period",
      });
    }

    const brandMap = {};

    // Duyệt qua từng đơn hàng
    for (const order of orders) {
      for (const item of order.cartItems) {
        const productId = item.productId;

        // Lấy thông tin sản phẩm từ Product model
        const product = await Product.findById(productId);

        if (product) {
          const brand = product.brand;

          // Nếu brand chưa có trong bản đồ, khởi tạo
          if (!brandMap[brand]) {
            brandMap[brand] = {
              totalQuantity: 0,
            };
          }

          // Cộng dồn số lượng
          brandMap[brand].totalQuantity += item.quantity;
        }
      }
    }

    // Chuyển đổi dữ liệu sang mảng để trả về
    const result = Object.keys(brandMap).map((brand) => ({
      brand,
      totalQuantity: brandMap[brand].totalQuantity,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCategoryOfOrder = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Nếu không có năm, mặc định là năm hiện tại
    const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();

    let startDate, endDate;

    if (month) {
      // Nếu có tháng, thống kê theo tháng
      const targetMonth = parseInt(month, 10) - 1; // JavaScript dùng chỉ số tháng từ 0-11
      startDate = new Date(targetYear, targetMonth, 1);
      endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59);
    } else {
      // Nếu không có tháng, thống kê cả năm
      startDate = new Date(targetYear, 0, 1);
      endDate = new Date(targetYear, 11, 31, 23, 59, 59);
    }

    // Lấy tất cả các đơn hàng trong khoảng thời gian đã chọn
    const orders = await Order.find({
      orderDate: { $gte: startDate, $lte: endDate },
    });

    if (!orders.length) {
      return res.json({
        message: "No orders found for the selected time period",
      });
    }

    const categoryMap = {};

    // Duyệt qua từng đơn hàng
    for (const order of orders) {
      for (const item of order.cartItems) {
        const productId = item.productId;

        // Lấy thông tin sản phẩm từ Product model
        const product = await Product.findById(productId);

        if (product) {
          const category = product.category;

          // Nếu category chưa có trong bản đồ, khởi tạo
          if (!categoryMap[category]) {
            categoryMap[category] = {
              totalQuantity: 0,
            };
          }

          // Cộng dồn số lượng
          categoryMap[category].totalQuantity += item.quantity;
        }
      }
    }

    // Chuyển đổi dữ liệu sang mảng để trả về
    const result = Object.keys(categoryMap).map((category) => ({
      category,
      totalQuantity: categoryMap[category].totalQuantity,
    }));

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrderFilter = async (req, res) => {
  try {
    const {
      customerName,
      fromDate,
      toDate,
      orderStatus,
      maxAmount,
      minAmount,
      paymentMethod,
    } = req.body;

    // Initialize an empty query object
    const query = {};

    // If customerName is provided, find matching user first
    if (customerName) {
      const user = await User.findOne({
        userName: { $regex: customerName, $options: "i" },
      });

      if (user) {
        query.userId = user._id;
      } else {
        return res.status(200).json({
          success: true,
          data: [],
          message: "No user found with given name",
        });
      }
    }

    // Date range filter
    if (fromDate || toDate) {
      query.orderDate = {};
      if (fromDate) query.orderDate.$gte = new Date(fromDate);
      if (toDate) query.orderDate.$lte = new Date(toDate);
    }

    // Order status filter
    if (orderStatus && orderStatus !== "all") {
      query.orderStatus = orderStatus;
    }

    // Payment method filter
    if (paymentMethod && paymentMethod !== "all") {
      query.paymentMethod = paymentMethod;
    }

    // Amount range filter
    if (maxAmount > 0 || minAmount >= 0) {
      query.totalAmount = {};
      if (minAmount > 0) query.totalAmount.$gte = minAmount;
      if (maxAmount > 0) query.totalAmount.$lte = maxAmount;
    }

    // Find orders with user details
    const orders = await Order.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "users", // Ensure this matches your actual users collection name
          let: { userId: { $toObjectId: "$userId" } }, // Convert userId to ObjectId
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
              },
            },
            {
              $project: {
                userName: 1,
                _id: 0, // Exclude _id to prevent conflicts
              },
            },
          ],
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          userId: 1,
          userName: "$userDetails.userName",
          cartItems: 1,
          addressInfo: 1,
          orderStatus: 1,
          paymentMethod: 1,
          paymentStatus: 1,
          totalAmount: 1,
          orderDate: 1,
          orderUpdateDate: 1,
        },
      },
    ]);

    // Return results
    res.status(200).json({
      success: true,
      data: orders,
      total: orders.length,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
  getRevenue,
  getBrandOfOrder,
  getCategoryOfOrder,
  getOrderFilter,
};
