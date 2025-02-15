const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");
const Order = require("../../models/Order");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

//add a new product
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    console.log(averageReview, "averageReview");

    const newlyCreatedProduct = new Product({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    await newlyCreatedProduct.save();
    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//fetch all products

const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});
    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    let findProduct = await Product.findById(id);
    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;
    findProduct.brand = brand || findProduct.brand;
    findProduct.price = price === "" ? 0 : price || findProduct.price;
    findProduct.salePrice =
      salePrice === "" ? 0 : salePrice || findProduct.salePrice;
    findProduct.totalStock = totalStock || findProduct.totalStock;
    findProduct.image = image || findProduct.image;
    findProduct.averageReview = averageReview || findProduct.averageReview;

    await findProduct.save();
    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

//delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

const getSalesByCategory = async (req, res) => {
  try {
    const { year, month } = req.query;

    let stats;
    if (year && month) {
      stats = await Order.aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $eq: [{ $year: "$orderDate" }, parseInt(year)] },
                { $eq: [{ $month: "$orderDate" }, parseInt(month)] },
              ],
            },
          },
        },
        {
          $unwind: "$cartItems",
        },
        {
          $lookup: {
            from: "products",
            localField: "cartItems.productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $group: {
            _id: {
              $coalesce: [{ $arrayElemAt: ["$product.category", 0] }, false],
            },
            totalCount: { $sum: "$cartItems.quantity" },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            totalCount: 1,
          },
        },
        {
          $sort: { totalCount: -1 },
        },
      ]);
    } else if (year) {
      stats = await Order.aggregate([
        {
          $match: {
            $expr: {
              $eq: [{ $year: "$orderDate" }, parseInt(year)],
            },
          },
        },
        {
          $unwind: "$cartItems",
        },
        {
          $lookup: {
            from: "products",
            localField: "cartItems.productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $group: {
            _id: {
              $coalesce: [{ $arrayElemAt: ["$product.category", 0] }, false],
            },
            totalCount: { $sum: "$cartItems.quantity" },
          },
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            totalCount: 1,
          },
        },
        {
          $sort: { totalCount: -1 },
        },
      ]);
    } else {
      return res
        .status(400)
        .json({ message: "year or year and month are required" });
    }

    res.json(stats);
  } catch (error) {
    console.error("Error during statistics:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getFilteredProducts = async (req, res) => {
  try {
    // Lấy các giá trị từ request query, nếu không có thì dùng defaultValues
    const {
      title = "",
      category = "all",
      maxAmount = 10000000,
      minAmount = 0,
      brand = "all",
    } = req.query;

    // Tạo điều kiện lọc (filter)
    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" }; // Tìm kiếm không phân biệt hoa thường
    }

    if (category !== "all") {
      filter.category = category;
    }

    if (brand !== "all") {
      filter.brand = brand;
    }

    filter.price = { $gte: Number(minAmount), $lte: Number(maxAmount) };

    // Thực hiện truy vấn
    const products = await Product.find(filter);

    // Trả về kết quả
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
  getSalesByCategory,
  getFilteredProducts,
};
