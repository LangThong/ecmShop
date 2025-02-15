export const registerFormControls = [
  {
    name: "userName",
    label: "Tên người dùng",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Mật khẩu",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Mật khẩu",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Tiêu đề",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Mô tả",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Danh mục",
    name: "category",
    componentType: "select",
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Thương hiệu",
    name: "brand",
    componentType: "select",
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "h&m", label: "H&M" },
    ],
  },
  {
    label: "Giá ",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Giá khuyễn mãi",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Hàng tồn kho",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Trang Chủ",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Sản Phẩm",
    path: "/shop/listing",
  },
  {
    id: "men",
    label: "Đàn Ông",
    path: "/shop/listing",
  },
  {
    id: "women",
    label: "Phụ Nữ",
    path: "/shop/listing",
  },
  {
    id: "kids",
    label: "Trẻ Em",
    path: "/shop/listing",
  },
  {
    id: "footwear",
    label: "Giày Dép",
    path: "/shop/listing",
  },
  {
    id: "accessories",
    label: "Phụ Kiện",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Tìm Kiếm",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  men: "Đàn Ông",
  women: "Phụ Nữ",
  kids: "Trẻ Em",
  accessories: "Phụ Kiện",
  footwear: "Giày Dép",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi",
  zara: "Zara",
  "h&m": "H&M",
};

export const filterOptions = {
  category: [
    { id: "men", label: "Đàn Ông" },
    { id: "women", label: "Phụ Nữ" },
    { id: "kids", label: "Trẻ Em" },
    { id: "accessories", label: "Phụ Kiện" },
    { id: "footwear", label: "Giày Dép" },
  ],
  brand: [
    { id: "nike", label: "Nike" },
    { id: "adidas", label: "Adidas" },
    { id: "puma", label: "Puma" },
    { id: "levi", label: "Levi's" },
    { id: "zara", label: "Zara" },
    { id: "h&m", label: "H&M" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Giá: Thấp tới cao" },
  { id: "price-hightolow", label: "Giá: Cao tới thấp" },
  { id: "title-atoz", label: "Tiêu đề: A tới Z" },
  { id: "title-ztoa", label: "Tiêu đề: Z tới A" },
];

export const addressFormControls = [
  {
    label: "Địa chỉ",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "Thành phố",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Mã địa chỉ",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Số điện thoại",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Ghi chú",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];

export const paymentMethods = [
  { value: "cash", label: "Tiền mặt" },
  { value: "momo", label: "MoMo" },
  { value: "bank_transfer", label: "Chuyển khoản ngân hàng" },
];

export const bankInformation = {
  acqId: "970423", // Mã ngân hàng
  accountNo: "30919074583", // Số tài khoản
  accountName: "Nguyen Le Duy Long", // Tên tài khoản
};
