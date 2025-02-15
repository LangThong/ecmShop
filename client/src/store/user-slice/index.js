import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  isLoading: false,
  userList: [],
  userDetail: null,
};
export const getUsers = createAsyncThunk("user/getUsers", async () => {
  const response = await axios.get("http://localhost:5000/api/admin/user/get");
  return response.data;
});

export const addUser = createAsyncThunk("user/addUser", async (user) => {
  const response = await axios.post(
    "http://localhost:5000/api/admin/user/add",
    user
  );
  return response.data;
});

export const getUserDetailsForAdmin = createAsyncThunk(
  "user/getDetail",
  async (id) => {
    const response = await axios.get(
      `http://localhost:5000/api/admin/user/detail/${id}`
    );

    return response.data;
  }
);

export const removeUser = createAsyncThunk("user/removeUser", async (id) => {
  const response = await axios.delete(
    `http://localhost:5000/api/admin/user/remove/${id}`
  );
  return response.data;
});

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ id, data }) => {
    const response = await axios.put(
      `http://localhost:5000/api/admin/user/update/${id}`,
      data
    );
    return response.data;
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserDetail: (state) => {
      console.log("resetUserDetails");

      state.userDetail = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userList = action.payload.data;
      })
      .addCase(getUsers.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(removeUser.fulfilled, (state, action) => {
        state.userList = state.userList.filter(
          (user) => user.id !== action.payload.data.id
        );
      })
      .addCase(getUserDetailsForAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserDetailsForAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userDetail = action.payload.data;
      })
      .addCase(getUserDetailsForAdmin.rejected, (state) => {
        state.isLoading = false;
        state.userDetail = null;
      });
  },
});

export const { resetUserDetail } = userSlice.actions;

export default userSlice.reducer;
