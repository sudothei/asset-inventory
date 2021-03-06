const BASE_URL = `${process.env.SERVER_HOSTNAME}:${process.env.API_PORT}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const deleteUsers = createAsyncThunk(
  "users/deleteUsers",
  async (user_ids: readonly string[]) => {
    for (let id of user_ids) {
      await axios.delete(`http://${BASE_URL}/users/${id}`);
    }
    return user_ids;
  }
);
export default deleteUsers;
