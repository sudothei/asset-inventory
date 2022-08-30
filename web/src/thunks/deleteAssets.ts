const BASE_URL = `${process.env.SERVER_HOSTNAME}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const deleteAssets = createAsyncThunk(
  "assets/deleteAssets",
  async (asset_ids: readonly string[]) => {
    const headers = {
      headers: {
        Authorization: "bearer " + localStorage.getItem("token"),
      },
    };
    for (let id of asset_ids) {
      await axios.delete(`http://${BASE_URL}/assets/${id}`, headers);
    }
    return asset_ids;
  }
);
export default deleteAssets;
