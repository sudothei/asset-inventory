const BASE_URL = `${process.env.SERVER_HOSTNAME}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface RequestPassFormData {
  oid: string;
  token: string;
}

const requestPassForm = createAsyncThunk(
  "password/requestPassForm",
  async (data: RequestPassFormData) => {
    const response = await axios.post(`http://${BASE_URL}/password`, {
      oid: data.oid,
      token: data.token,
    });
    return response.data;
  }
);
export default requestPassForm;
