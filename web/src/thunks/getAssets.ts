// TODO replace with ENV VAR somehow
const SERVER_HOSTNAME = "localhost:8080";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getAssets = createAsyncThunk("assets/addAsset", async () => {
  const response = await fetch(`http://${SERVER_HOSTNAME}/assets`);
  return await response.json();
});
export default getAssets;
