const BASE_URL = `${process.env.API_HOSTNAME}:${process.env.API_PORT}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import UserRequest from "types/UserRequest";
import User from "types/User";
import axios from "axios";

const addUser = createAsyncThunk("users/addUser", async (user: UserRequest) => {
  const response = await axios.post(`http://${BASE_URL}/users`, user);
  const newUser: User = { _id: response.data, status: "Pending", ...user };
  return newUser;
});
export default addUser;
