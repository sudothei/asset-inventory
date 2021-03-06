const BASE_URL = `${process.env.SERVER_HOSTNAME}:${process.env.API_PORT}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import Asset from "types/Asset";
import axios from "axios";

const editAsset = createAsyncThunk("assets/editAsset", async (asset: Asset) => {
  await axios.put(`http://${BASE_URL}/assets/${asset._id.$oid}`, asset);
  const newAsset: Asset = asset;
  return newAsset;
});
export default editAsset;
