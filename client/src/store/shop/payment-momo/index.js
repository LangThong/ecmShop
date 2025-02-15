// src/slices/paymentMomoSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  paymentUrl: null,
  loading: false,
  error: null,
};
// Thunk: Gửi yêu cầu thanh toán MoMo và nhận dữ liệu trả về (URL thanh toán)
export const initiatePayment = createAsyncThunk(
  "paymentMomo/payment",
  async (order) => {
    try {
      // Gửi yêu cầu thanh toán đến backend của bạn
      const response = await axios.post(
        "http://localhost:5000/api/shop/paymentmomo/payment",
        order
      );
      return response.data; // Dữ liệu trả về từ MoMo (ví dụ URL thanh toán)
    } catch (error) {
      return error; // Nếu có lỗi, trả về lỗi
    }
  }
);

// Slice: Định nghĩa trạng thái và reducers
const paymentMomoSlice = createSlice({
  name: "paymentMomoSlice",
  initialState,
  reducers: {
    resetPaymentState: (state) => {
      state.paymentUrl = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentUrl = action.payload.payUrl; // Lưu URL thanh toán trả về từ MoMo
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message; // Lưu lỗi nếu có
      });
  },
});

export const { resetPaymentState } = paymentMomoSlice.actions;

export default paymentMomoSlice.reducer;
