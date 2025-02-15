/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useDispatch } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  updateOrderStatus,
} from "@/store/admin/order-slice";
import { useToast } from "../ui/use-toast";
import moment from "moment-timezone";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  getUserDetailsForAdmin,
  getUsers,
  updateUser,
} from "@/store/user-slice";

function AdminCreateUserView({ userDetail }) {
  const dispatch = useDispatch();
  const { toast } = useToast();

  // Sử dụng useForm để đăng ký các trường và truyền defaultValues
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue, // Để set giá trị mặc định cho các trường nếu cần
  } = useForm({
    mode: "onChange",
    defaultValues: userDetail, // Truyền userDetail làm giá trị mặc định
  });

  useEffect(() => {
    if (userDetail) {
      // Nếu userDetail thay đổi, cập nhật giá trị mặc định cho form
      Object.keys(userDetail).forEach((key) => {
        setValue(key, userDetail[key]);
      });
    }
  }, [userDetail, setValue]);

  const onSubmit = async (data) => {
    // Xử lý khi form được submit
    console.log(data);
    const payload = {
      userName: data?.userName,
      email: data?.email,
      role: data?.role,
    };
    dispatch(updateUser({ id: data._id, data: payload }))
      .then((data) => {
        if (data?.payload?.success) {
          dispatch(getUserDetailsForAdmin(userDetail?._id));
          dispatch(getUsers());
          console.log(data);
          toast({
            title: "Cập nhật thông tin người dùng thành công",
          });
        }
      })
      .catch((err) => {});
  };

  return (
    <DialogContent className="sm:max-w-[600px]">
      <h1 className="text-lg font-medium">Thông Tin Người Dùng</h1>
      <div className="grid gap-6">
        <form
          className="px-4 sm:px-6 flex flex-col gap-3 2xl:gap-6"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <Label htmlFor="_id">ID: </Label>
            <Label
              id="_id"
              //   placeholder="Mã tài khoản"
              //   type="text"
              {...register("_id", { required: "Tên là bắt buộc" })}
              error={errors.id ? errors.id?.message : ""}
              htmlFor="_id"
              className="pl-2"
            >
              {userDetail?._id}
            </Label>
          </div>

          <div>
            <Label htmlFor="userName">Tên Tài Khoản</Label>
            <Input
              id="userName"
              placeholder="Nhập tên..."
              type="text"
              {...register("userName")}
              error={errors.userName ? errors.userName?.message : ""}
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Email..."
              type="email"
              {...register("email")}
              error={errors.email ? errors.email?.message : ""}
            />
          </div>

          <div>
            <Label htmlFor="role">Vai Trò</Label>
            <select
              id="role"
              {...register("role", { required: "Vai trò là bắt buộc" })} // register để xử lý với react-hook-form
              className="input-field flex  flex-1 w-full py-2"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="text-red-500">{errors.role.message}</p>
            )}
          </div>

          {userDetail?.createdAt && (
            <div>
              <Label htmlFor="_id">Ngày Tạo: </Label>
              <Label
                id="_id"
                //   placeholder="Mã tài khoản"
                //   type="text"
                {...register("_id", { required: "Tên là bắt buộc" })}
                error={errors.id ? errors.id?.message : ""}
                htmlFor="_id"
                className="pl-2"
              >
                {moment(userDetail?.createdAt)
                  .tz("Asia/Ho_Chi_Minh")
                  .format("YYYY-MM-DD HH:mm:ss")}
              </Label>
            </div>
          )}
          {userDetail?.updatedAt && (
            <div>
              <Label htmlFor="_id">Ngày Cập Nhật: </Label>
              <Label
                id="_id"
                //   placeholder="Mã tài khoản"
                //   type="text"
                {...register("_id", { required: "Tên là bắt buộc" })}
                error={errors.id ? errors.id?.message : ""}
                htmlFor="_id"
                className="pl-2"
              >
                {moment(userDetail?.updatedAt)
                  .tz("Asia/Ho_Chi_Minh")
                  .format("YYYY-MM-DD HH:mm:ss")}
              </Label>
            </div>
          )}

          <div className="py-5 sm:flex sm:flex-row-reverse border-t border-[#66666645]">
            <Button
              type="submit"
              containerStyles={`inline-flex justify-center rounded-md bg-blue-500 px-8 py-3 text-sm font-medium text-white outline-none`}
            >
              Cập nhật
            </Button>
          </div>
        </form>

        <Separator />
      </div>
    </DialogContent>
  );
}

export default AdminCreateUserView;
