const BASE_URL = `${process.env.API_HOSTNAME}:${process.env.API_PORT}`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import AssetRequest from "types/AssetRequest";
import Asset from "types/Asset";
import axios from "axios";

const editAsset = createAsyncThunk(
  "assets/editAsset",
  async (asset: AssetRequest) => {
    const assetClone = asset;
    delete assetClone.oid;
    console.log(assetClone);
    const response = await axios.put(`http://${BASE_URL}/assets`, assetClone);
    const newAsset: Asset = { _id: response.data, ...asset };
    console.log(newAsset);
    return newAsset;
  }
);
export default editAsset;
