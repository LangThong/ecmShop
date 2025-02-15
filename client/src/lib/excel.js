/* eslint-disable no-unused-vars */
import * as XLSX from "xlsx";

const exportToExcel = (data, fileName = "DataExport.xlsx") => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error("Dữ liệu không hợp lệ hoặc rỗng.");
    return;
  }

  try {
    // Lấy thời gian hiện tại để thêm vào tên file
    const now = new Date();
    const timestamp = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
      .getHours()
      .toString()
      .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}${now
      .getSeconds()
      .toString()
      .padStart(2, "0")}`;

    // Tạo tên file với timestamp
    const finalFileName = fileName.replace(/\.xlsx$/, `_${timestamp}.xlsx`);

    // Chuyển đổi dữ liệu thành định dạng sheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Tạo workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Xuất file
    XLSX.writeFile(workbook, finalFileName);
    console.log(`File ${finalFileName} đã được xuất thành công!`);
  } catch (error) {
    console.error("Đã xảy ra lỗi khi xuất file Excel:", error);
  }
};

export default exportToExcel;
