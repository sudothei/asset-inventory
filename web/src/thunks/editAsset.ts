const BASE_URL = `${process.env.SERVER_HOSTNAME}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import Asset from "types/Asset";
import axios from "axios";

const editAsset = createAsyncThunk("assets/editAsset", async (asset: Asset) => {
  const headers = {
    headers: {
      Authorization: "bearer " + localStorage.getItem("token"),
    },
  };
  await axios.put(
    `http://${BASE_URL}/assets/${asset._id.$oid}`,
    asset,
    headers
  );
  const newAsset: Asset = asset;
  return newAsset;
});
export default editAsset;
