const BASE_URL = `${process.env.SERVER_HOSTNAME}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const sendPassReset = createAsyncThunk(
  "password/sendPassReset",
  async (email: string) => {
    axios.get(`http://${BASE_URL}/password/${email}`);
  }
);
export default sendPassReset;
