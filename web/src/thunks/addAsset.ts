const BASE_URL = `${process.env.SERVER_HOSTNAME}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import AssetRequest from "types/AssetRequest";
import Asset from "types/Asset";
import axios from "axios";

const addAsset = createAsyncThunk(
  "assets/addAsset",
  async (asset: AssetRequest) => {
    const headers = {
      headers: {
        Authorization: "bearer " + localStorage.getItem("token"),
      },
    };
    const response = await axios.post(
      `http://${BASE_URL}/assets`,
      asset,
      headers
    );
    const newAsset: Asset = { _id: response.data, ...asset };
    return newAsset;
  }
);
export default addAsset;
