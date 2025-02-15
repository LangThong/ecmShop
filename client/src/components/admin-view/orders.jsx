/* eslint-disable react/prop-types */
/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  getOrderFilter,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { useTable, usePagination } from "react-table";
import { useForm } from "react-hook-form";
import { ArrowDownToLine, RotateCcw, Search } from "lucide-react";
import exportToExcel from "@/lib/excel";

const formatDateTimeLocal = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { orderList, orderDetails } = useSelector((state) => state.adminOrder);
  const dispatch = useDispatch();
  const today = new Date();

  // Đầu ngày hôm nay (00:00 giờ địa phương)
  const defaultFromDate = formatDateTimeLocal(
    new Date(today.setHours(0, 0, 0, 0))
  );

  // Cuối ngày hôm nay (23:59 giờ địa phương)
  const defaultToDate = formatDateTimeLocal(
    new Date(today.setHours(23, 59, 59, 999))
  );

  const defaultValues = {
    customerName: "",
    fromDate: defaultFromDate,
    toDate: defaultToDate,
    orderStatus: "all",
    maxAmount: 10000000,
    minAmount: 0,
    paymentMethod: "all",
  };

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues,
  });

  const onSubmit = (data) => {
    // console.log(data);
    dispatch(getOrderFilter(data));
    // console.log(orderList);
  };
  const handResetForm = () => {
    reset();
    dispatch(getOrderFilter(defaultValues));
  };

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  useEffect(() => {
    dispatch(getOrderFilter(defaultValues));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  // Define columns for React Table
  const columns = useMemo(
    () => [
      {
        Header: "Mã đơn hàng",
        accessor: "_id", // Access order ID
      },
      {
        Header: "Tên khách hàng",
        accessor: "userName", // Access order ID
      },
      {
        Header: "Ngày đặt",
        accessor: "orderDate",
        Cell: ({ value }) => value.split("T")[0], // Format date
      },
      {
        Header: "Trạng thái",
        accessor: "orderStatus",
        Cell: ({ value }) => (
          <Badge
            className={`py-1 px-3 ${
              value === "delivered"
                ? "bg-green-400"
                : value === "rejected"
                ? "bg-red-600"
                : "bg-black"
            }`}
          >
            {value}
          </Badge>
        ),
      },
      {
        Header: "Tổng tiền",
        accessor: "totalAmount",
      },
      {
        Header: "Chức năng",
        accessor: "actions",
        Cell: ({ row }) => (
          <Dialog
            open={openDetailsDialog}
            onOpenChange={() => {
              setOpenDetailsDialog(false);
              dispatch(resetOrderDetails());
            }}
          >
            <Button
              onClick={() => handleFetchOrderDetails(row.original._id)}
              className="rounded-full py-1 h-8"
            >
              Chi tiết
            </Button>
            <AdminOrderDetailsView orderDetails={orderDetails} />
          </Dialog>
        ),
      },
    ],
    [openDetailsDialog, orderDetails]
  );

  // Use React Table hooks
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize },
    canNextPage,
    canPreviousPage,
    nextPage,
    previousPage,
    setPageSize,
    gotoPage, // Add this to reset pageIndex when changing rows per page
  } = useTable(
    {
      columns,
      data: orderList || [],
      initialState: { pageIndex: 0, pageSize: 10 }, // Set initial page size
    },
    usePagination
  );

  // Handle rows per page change
  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    setPageSize(newPageSize); // Update page size
    gotoPage(0); // Reset to the first page
  };

  const paginatedData = useMemo(() => {
    const startRow = pageIndex * pageSize;
    const endRow = startRow + pageSize;
    return rows.slice(startRow, endRow); // rows là dữ liệu toàn bộ của bảng
  }, [rows, pageIndex, pageSize]);

  const handExportExcel = () => {
    if (!Array.isArray(orderList) || orderList.length === 0) {
      console.error("Danh sách đơn hàng rỗng hoặc không hợp lệ.");
      console.log(orderList);
      return;
    }
    console.log("xuatFile");
    // Chuyển đổi orderList thành dữ liệu cần xuất
    const data = orderList.map((order) => ({
      _id: order._id,
      UserId: order.userId,
      UserName: order.userName,
      TotalAmount: order.totalAmount,
      PaymentMethod: order.paymentMethod,
      PaymentStatus: order.paymentStatus,
      OrderStatus: order.orderStatus,
      Quantity: order.cartItems.length, // Số lượng sản phẩm trong giỏ hàng
      OrderDate: order.orderDate,
    }));

    // Gọi hàm exportToExcel để xuất file
    exportToExcel(data, "OrderList.xlsx");
  };

  return (
    <Card>
      <CardHeader className="flex justify-between flex-row">
        <CardTitle className="text-xl">Đơn Hàng</CardTitle>
        <button
          type="button"
          //   onClick={handleReset}
          className="px-6 py-2 bg-blue-600 text-white rounded-sm flex text-center items-center gap-2"
          onClick={handExportExcel}
        >
          <ArrowDownToLine size={20} />
          <span>Xuất file</span>
        </button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-8">
          <div className="grid grid-cols-3 gap-3 outline-emerald-200 relative">
            {/* From Date */}
            <div>
              <label className="block text-sm font-medium text-blue-900">
                Từ ngày
              </label>
              <input
                type="datetime-local"
                {...register("fromDate")}
                className="mt-1 block w-full border border-gray-200 rounded-md p-1"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="text-blue-900 block text-sm font-medium">
                Đến ngày
              </label>
              <input
                type="datetime-local"
                {...register("toDate")}
                className="mt-1 block w-full border border-gray-200 rounded-md p-1"
              />
            </div>

            {/* Customer Name */}
            <div>
              <label className="text-blue-900 block text-sm font-medium">
                Tên khách hàng
              </label>
              <input
                type="text"
                {...register("customerName")}
                placeholder="Nhập tên khách hàng"
                className="mt-1 block w-full border border-gray-200 rounded-md p-1"
              />
            </div>

            {/* Status */}
            <div>
              <label className="text-blue-900 block text-sm font-medium">
                Trạng thái
              </label>
              <select
                {...register("orderStatus")}
                className="mt-1 block w-full border border-gray-200 rounded-md p-1"
              >
                <option value="all">Tất cả</option>
                <option value="pending">Đang xử lý</option>
                <option value="shipping">Đang giao</option>
                <option value="delivered">Đã hoàn thành</option>
                <option value="rejected">Đã hủy</option>
              </select>
            </div>

            {/* Min Amount */}
            <div>
              <label className="text-blue-900 block text-sm font-medium">
                Từ số tiền
              </label>
              <input
                type="number"
                {...register("minAmount")}
                placeholder="Từ số tiền"
                className="mt-1 block w-full border border-gray-200 rounded-md p-1"
              />
            </div>

            {/* Max Amount */}
            <div>
              <label className="text-blue-900 block text-sm font-medium">
                Đến số tiền
              </label>
              <input
                type="number"
                {...register("maxAmount")}
                placeholder="Đến số tiền"
                className="mt-1 block w-full border border-gray-200 rounded-md p-1"
              />
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-blue-900 block text-sm font-medium">
                Phương thức thanh toán
              </label>
              <select
                {...register("paymentMethod")}
                className="mt-1 block w-full border border-gray-200 rounded-md p-1"
              >
                <option value="all">Tất cả</option>
                <option value="momo">Momo</option>
                <option value="bank_transfer">Chuyển khoản ngân hàng</option>
                <option value="cash">Tiền mặt</option>
              </select>
            </div>
            {/* Action buttons */}
            <div className=" flex gap-4 absolute bottom-0 right-0">
              <button
                type="button"
                //   onClick={handleReset}
                className="px-6 py-2 bg-[#00d1b2] text-white rounded-sm flex text-center items-center gap-2"
                onClick={handResetForm}
              >
                <RotateCcw size={20} />
                <span>Làm mới</span>
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-sm flex text-center items-center gap-2"
              >
                <Search size={20} />
                <span>Tìm kiếm</span>
              </button>
            </div>
          </div>
        </form>
        <Table
          {...getTableProps()}
          className="border border-gray-300 text-center"
        >
          <TableHeader className="bg-blue-100">
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableHead
                    {...column.getHeaderProps()}
                    className="border border-gray-300 text-center"
                  >
                    {column.render("Header")}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {paginatedData.map((row) => {
              prepareRow(row);
              return (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <TableCell
                      {...cell.getCellProps()}
                      className="py-3 border border-gray-300"
                    >
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Pagination Controls */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-4 py-2 bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {pageIndex + 1} of {Math.ceil(orderList.length / pageSize)}
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-4 py-2 bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Select rows per page */}
        <div className="mt-2">
          <label>Rows per page: </label>
          <select
            value={pageSize}
            onChange={handlePageSizeChange} // Use the handler here
            className="ml-2"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </CardContent>
    </Card>
  );
}

export default AdminOrdersView;
