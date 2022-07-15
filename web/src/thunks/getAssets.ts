const BASE_URL = `${process.env.API_HOSTNAME}:${process.env.API_PORT}`;
import { createAsyncThunk } from "@reduxjs/toolkit";

const getAssets = createAsyncThunk("assets/addAsset", async () => {
  const response = await fetch(`http://${BASE_URL}/assets`);
  return await response.json();
});
export default getAssets;
