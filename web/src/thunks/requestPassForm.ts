const BASE_URL = `${process.env.SERVER_HOSTNAME}:${process.env.API_PORT}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface RequestPassFormData {
  oid: string;
  token: string;
}

const requestPassForm = createAsyncThunk(
  "users/requestPassForm",
  async (data: RequestPassFormData) => {
    const response = await axios.get(
      `http://${BASE_URL}/users/${data.oid}/${data.token}`
    );
    return await response.data;
  }
);
export default requestPassForm;
