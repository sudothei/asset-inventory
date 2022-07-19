const BASE_URL = `${process.env.API_HOSTNAME}:${process.env.API_PORT}`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAssets = createAsyncThunk("assets/getAssets", async () => {
  const response = await axios.get(`http://${BASE_URL}/assets`);
  return await response.data;
});
export default getAssets;
