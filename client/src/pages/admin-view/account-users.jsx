/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge, Plus } from "lucide-react";
import {
  getUsers,
  addUser,
  removeUser,
  getUserDetailsForAdmin,
  resetUserDetail,
} from "@/store/user-slice";
import AdminUserDetailView from "@/components/admin-view/user-detail";
import { useTable, usePagination } from "react-table";

function AccountUsers() {
  const { userList, userDetail } = useSelector((state) => state.user);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [createUser, setCreateUser] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);

  useEffect(() => {
    if (userDetail !== null) setOpenDetailsDialog(true);
    if (createUser) setOpenDetailsDialog(true);
  }, [userDetail, createUser]);

  function handleFetchUserDetails(getId) {
    dispatch(getUserDetailsForAdmin(getId));
  }

  function handCreateUser() {
    setCreateUser(true);
  }

  // Cấu hình các cột cho React Table
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "_id",
      },
      {
        Header: "Tên",
        accessor: "userName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Vai Trò",
        accessor: "role",
        Cell: ({ value }) => value.charAt(0).toUpperCase() + value.slice(1), // Chuyển đổi chữ cái đầu thành chữ hoa
      },
      {
        Header: "Chức năng",
        accessor: "actions",
        Cell: ({ row }) => (
          <Dialog
            open={openDetailsDialog}
            onOpenChange={() => {
              setOpenDetailsDialog(false);
              dispatch(resetUserDetail());
              setCreateUser(false);
            }}
          >
            <Button
              onClick={() => handleFetchUserDetails(row.original._id)}
              className="px-3 py-0 h-8 rounded-2xl"
            >
              Chi tiết
            </Button>
            <AdminUserDetailView
              userDetail={userDetail}
              title={createUser ? "Tạo Tài Khoản" : "Thông Tin Người Dùng"}
              createUser={createUser}
              handCloseView={() => {
                setOpenDetailsDialog(false);
                setCreateUser(false);
              }}
            />
          </Dialog>
        ),
      },
    ],
    [openDetailsDialog, userDetail, createUser]
  );

  // Thiết lập React Table
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
    gotoPage,
  } = useTable(
    {
      columns,
      data: userList || [], // Dữ liệu người dùng
      initialState: { pageIndex: 0, pageSize: 10 }, // Trang đầu tiên và số hàng mặc định
    },
    usePagination
  );

  // Hàm thay đổi số hàng hiển thị mỗi trang
  const handlePageSizeChange = (e) => {
    const newPageSize = Number(e.target.value);
    setPageSize(newPageSize);
    gotoPage(0); // Quay về trang đầu tiên
  };

  const paginatedData = useMemo(() => {
    const startRow = pageIndex * pageSize;
    const endRow = startRow + pageSize;
    return rows.slice(startRow, endRow); // rows là dữ liệu toàn bộ của bảng
  }, [rows, pageIndex, pageSize]);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center ">
        <CardTitle>Danh Sách Tài Khoản</CardTitle>
        <Button onClick={handCreateUser}>
          <Plus className="mr-2 text-sm" />
          <span>Tạo mới</span>
        </Button>
      </CardHeader>

      <CardContent>
        <Table {...getTableProps()}>
          <TableHeader>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <TableHead {...column.getHeaderProps()}>
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
                    <TableCell {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {/* Điều khiển phân trang */}
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className="px-4 py-2 bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {pageIndex + 1} of {Math.ceil(userList.length / pageSize)}
          </span>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className="px-4 py-2 bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>

        {/* Số hàng trên mỗi trang */}
        <div className="mt-2">
          <label>Rows per page: </label>
          <select
            value={pageSize}
            onChange={handlePageSizeChange}
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

export default AccountUsers;
