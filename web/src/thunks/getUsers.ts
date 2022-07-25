const BASE_URL = `${process.env.API_HOSTNAME}:${process.env.API_PORT}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getUsers = createAsyncThunk("users/getUsers", async () => {
  const response = await axios.get(`http://${BASE_URL}/users`);
  return await response.data;
});
export default getUsers;
