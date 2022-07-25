const BASE_URL = `${process.env.SERVER_HOSTNAME}:${process.env.API_PORT}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const deleteAssets = createAsyncThunk(
  "assets/deleteAssets",
  async (asset_ids: readonly string[]) => {
    for (let id of asset_ids) {
      await axios.delete(`http://${BASE_URL}/assets/${id}`);
    }
    return asset_ids;
  }
);
export default deleteAssets;
