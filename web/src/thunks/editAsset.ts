const BASE_URL = `${process.env.API_HOSTNAME}:${process.env.API_PORT}`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import Asset from "types/Asset";
import axios from "axios";

const editAsset = createAsyncThunk("assets/editAsset", async (asset: Asset) => {
  await axios.put(`http://${BASE_URL}/assets/${asset._id.$oid}`, asset);
  const newAsset: Asset = asset;
  return newAsset;
});
export default editAsset;
