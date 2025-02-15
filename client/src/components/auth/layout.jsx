/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import { Outlet } from "react-router-dom";
import accImg from "../../assets/shop_banner.jpg";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <div className=" relative hidden lg:flex items-center justify-center bg-black w-1/2 ">
        <img
          src={accImg}
          alt="Shop Banner"
          className="w-full h-full object-cover "
        />
        <div className=" text-center text-primary-foreground absolute">
          <h1 className="text-4xl font-extrabold ">
            Chào mừng bạn tới với cửa hàng!
          </h1>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
