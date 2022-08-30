const BASE_URL = `${process.env.SERVER_HOSTNAME}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getUsers = createAsyncThunk("users/getUsers", async () => {
  const headers = {
    headers: {
      Authorization: "bearer " + localStorage.getItem("token"),
    },
  };
  const response = await axios.get(`http://${BASE_URL}/users`, headers);
  return response.data;
});
export default getUsers;
