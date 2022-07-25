const BASE_URL = `${process.env.SERVER_HOSTNAME}:${process.env.API_PORT}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAssets = createAsyncThunk("assets/getAssets", async () => {
  const response = await axios.get(`http://${BASE_URL}/assets`);
  return await response.data;
});
export default getAssets;
