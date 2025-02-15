/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { updateUser } from "@/store/auth-slice";
import { useToast } from "../ui/use-toast";

const UpdateUserForm = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: user?.email,
      userName: user?.userName,
      phoneNumber: user?.phoneNumber || "",
      gender: user?.gender || "",
    },
  });

  const handleFormSubmit = (data) => {
    console.log(data); // Hàm onSubmit để xử lý dữ liệu khi người dùng gửi form
    dispatch(updateUser(data)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: "Cập nhật thông tin thành công",
        });
      } else {
        toast({
          title: "Cập nhật thông tin thất bại",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3 ">
          <div className="min-w-24">
            <label className="font-normal text-base ">Email</label>
          </div>
          <Input
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        <div className="flex items-center gap-3">
          <div className="min-w-24">
            <label>Tên</label>
          </div>
          <Input
            type="text"
            {...register("userName", { required: "User name is required" })}
          />
          {errors.userName && <p>{errors.userName.message}</p>}
        </div>

        <div className="flex items-center gap-3">
          <div className="min-w-24">
            <label>Số điện thoại</label>
          </div>
          <Input
            type="text"
            {...register("phoneNumber", {
              pattern: /^[0-9]{10,15}$/,
              message: "Phone number is invalid",
            })}
          />
          {errors.phoneNumber && <p>{errors.phoneNumber.message}</p>}
        </div>

        <div className="flex ">
          <div className="min-w-24">
            <label>Giới tính</label>
          </div>
          <div className="flex gap-7 ml-3">
            <label className="flex items-center space-x-1 ">
              <input
                className="w-5 h-5"
                type="radio"
                value="male"
                {...register("gender", { required: "Gender is required" })}
              />
              <span>Nam</span>
            </label>
            <label className="flex items-center space-x-1 ">
              <input
                className="w-5 h-5"
                type="radio"
                value="female"
                {...register("gender", { required: "Gender is required" })}
              />
              <span>Nữ</span>
            </label>
            <label className="flex items-center space-x-1 ">
              <input
                className="w-5 h-5"
                type="radio"
                value="other"
                {...register("gender", { required: "Gender is required" })}
              />
              <span>Khác</span>
            </label>
          </div>
        </div>
      </div>

      <Button className="px-8 py-4 mt-8 rounded-sm text-lg" type="submit">
        Lưu
      </Button>
    </form>
  );
};

export default UpdateUserForm;
