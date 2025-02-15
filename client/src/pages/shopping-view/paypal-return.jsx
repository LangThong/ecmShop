/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-key */
import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import { bankInformation } from "@/config/index";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { getOrderDetails } from "@/store/shop/order-slice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { initiatePayment } from "@/store/shop/payment-momo";
function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  //   const { paymentUrl } = useSelector((state) => state.paymentMomo);
  const { idOrder } = useParams();
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [qrImage, setQrImage] = useState(null);
  const [order, setOrder] = useState({});
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate();
  function handleInitiatePaypalPayment() {
    navigate("/shop/payment-success");
  }
  useEffect(() => {
    if (idOrder) {
      dispatch(getOrderDetails(idOrder)).then((data) => {
        if (data.payload?.data) {
          setOrder(data.payload?.data);
          setPaymentMethod(data.payload?.data.paymentMethod);
          if (data.payload?.data.paymentMethod === "cash") {
            navigate("/shop/home");
          } else {
            if (data.payload?.data.paymentMethod === "bank_transfer") {
              generateQRCode();
            } else {
              const order = data.payload?.data;
              dispatch(initiatePayment({ order })).then((data) => {
                console.log(data);
                if (data?.payload) {
                  // console.log(data?.payload?.payUrl);
                  window.open(data?.payload?.payUrl, "_blank");
                }
              });
            }
          }
        } else {
          navigate("/shop/home");
        }
      });
    }
  }, [idOrder]);

  const generateQRCode = async () => {
    try {
      // Lấy danh sách ngân hàng
      const bankResponse = await axios.get("https://api.vietqr.io/v2/banks");
      const bankData = bankResponse.data;

      // Tạo yêu cầu API VietQR
      const apiRequest = {
        acqId: bankInformation.acqId, // Mã ngân hàng
        accountNo: bankInformation.accountNo, // Số tài khoản
        accountName: bankInformation.accountName, // Tên tài khoản
        amount: order?.totalAmount, // Số tiền
        format: "text",
        template: "compact2",
      };
      const response = await axios.post(
        "https://api.vietqr.io/v2/generate",
        apiRequest,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      // Nhận và xử lý dữ liệu hình ảnh mã QR
      const qrDataURL = response.data.data.qrDataURL;
      const base64Image = qrDataURL.replace("data:image/png;base64,", "");
      setQrImage(`data:image/png;base64,${base64Image}`);
    } catch (error) {
      console.error("Lỗi kết nối mạng hoặc lỗi API", error);
      alert("Kiểm Tra kết nối mạng");
    }
  };
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[230px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <h2 className="text-xl font-semibold text-center">Mã Thanh Toán</h2>
      {qrImage && (
        <div className="flex-1 w-full flex justify-center items-center">
          <img className="w-80 " src={qrImage} alt="QR Code" />
        </div>
      )}
      <Button
        onClick={handleInitiatePaypalPayment}
        className="p-3 max-w-[250px] "
      >
        Đã Thanh Toán
      </Button>
    </div>
  );
}

export default ShoppingCheckout;
