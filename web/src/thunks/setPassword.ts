const BASE_URL = `${process.env.SERVER_HOSTNAME}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface SetPassword {
  oid: string;
  token: string;
  password: string;
}

const setPassword = createAsyncThunk(
  "password/setPassword",
  async (data: SetPassword) => {
    const response = await axios.put(`http://${BASE_URL}/password`, data);
    return response.data;
  }
);
export default setPassword;
