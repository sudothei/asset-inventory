const BASE_URL = `${process.env.SERVER_HOSTNAME}:${process.env.API_PORT}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const sendPassReset = createAsyncThunk(
  "users/sendPassReset",
  async (oid: string) => {
    axios.get(`http://${BASE_URL}/password/${oid}`);
  }
);
export default sendPassReset;
