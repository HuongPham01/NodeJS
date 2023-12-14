const sql = require("../models/db");

const sortMiddleware = (req, res) => {
  // Lấy giá trị tham số sort từ URL
  const sortParam = req.query.budget;

  // Kiểm tra xem tham số sort có hợp lệ không
  // Nếu hợp lệ, đặt giá trị sortOrder là giá trị tham số sort, ngược lại là null
  const sortOrder = isValidSortOrder(sortParam)
    ? sortParam.toLowerCase()
    : null;

  // Query để lấy tất cả sản phẩm từ cơ sở dữ liệu
  const productQuery = "SELECT * FROM products";

  // Thực hiện truy vấn SQL
  sql.query(productQuery, (productErr, productRes) => {
    if (productErr) {
      // Trả về lỗi nếu có lỗi trong quá trình truy vấn
      return res.status(500).json({ error: productErr.message });
    }

    // Tạo một bản sao của mảng sản phẩm để tránh ảnh hưởng đến mảng gốc
    let sortedProducts = [...productRes];

    // Kiểm tra xem có thực hiện sắp xếp không
    if (sortOrder) {
      // Nếu có thực hiện sắp xếp dựa trên sortOrder
      sortedProducts.sort((a, b) => {
        return sortOrder === "desc" ? b.price - a.price : a.price - b.price;
      });
    }

    // Trả về danh sách sản phẩm (đã sắp xếp nếu có, ngược lại, toàn bộ sản phẩm)
    res.json(sortedProducts);
  });
};

// Hàm kiểm tra tính hợp lệ của sortOrder
const isValidSortOrder = (sortOrder) => {
  const validOrders = ["asc", "desc"];
  return validOrders.includes(sortOrder?.toLowerCase());
};

// Xuất module để có thể sử dụng trong các tệp khác
module.exports = sortMiddleware;
