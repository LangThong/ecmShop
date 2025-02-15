/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
import CommonForm from "@/components/common/form";
import { useToast } from "@/components/ui/use-toast";
import { loginFormControls } from "@/config";
import { loginUser, LoginWithGoogle } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    dispatch(loginUser(formData))
      .then((data) => {
        if (data?.payload?.success) {
          toast({
            title: "Đăng nhập thành công",
          });
        } else {
          toast({
            title: "Đăng nhập thất bại",
            variant: "destructive",
          });
        }
      })
      .catch(() => {
        toast({
          title: "Đăng nhập thất bại",
          variant: "destructive",
        });
      });
  }

  const handLoginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const { access_token } = tokenResponse;
      console.log(tokenResponse);
      dispatch(LoginWithGoogle(access_token));
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Đăng Nhập Bằng Tài Khoản Của Bạn
        </h1>
        <p className="mt-2">
          Chưa có tài khoản?
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Đăng ký
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Đăng nhập"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
      <div className="flex justify-between gap-3">
        <button
          className="flex border flex-1 border-gray-400 px-5 py-2 items-center gap-2 rounded-sm justify-center"
          onClick={() => handLoginGoogle()}
        >
          <FaFacebook className="text-[#0866ff]" size={24} />
          <span>Facebook</span>
        </button>
        <button
          className="flex border flex-1 border-gray-400 px-5 py-2 items-center gap-2 rounded-sm justify-center"
          onClick={() => handLoginGoogle()}
        >
          <FcGoogle size={24} />
          <span> Google</span>
        </button>
      </div>
    </div>
  );
}

export default AuthLogin;
