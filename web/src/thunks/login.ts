const BASE_URL = `${process.env.SERVER_HOSTNAME}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import LoginForm from "types/LoginForm";

const login = createAsyncThunk("auth/login", async (data: LoginForm) => {
  const response = await axios.post(`http://${BASE_URL}/login`, data);
  return await response.data;
});
export default login;
