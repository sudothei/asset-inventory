const BASE_URL = `${process.env.SERVER_HOSTNAME}:${process.env.API_PORT}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getAssets = createAsyncThunk("assets/getAssets", async () => {
  const headers = {
    headers: {
      Authorization: "bearer " + localStorage.getItem("token"),
    },
  };
  const response = await axios.get(`http://${BASE_URL}/assets`, headers);
  return response.data;
});
export default getAssets;
