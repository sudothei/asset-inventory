const BASE_URL = `${process.env.SERVER_HOSTNAME}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const deleteUsers = createAsyncThunk(
  "users/deleteUsers",
  async (user_ids: readonly string[]) => {
    const headers = {
      headers: {
        Authorization: "bearer " + localStorage.getItem("token"),
      },
    };
    for (let id of user_ids) {
      await axios.delete(`http://${BASE_URL}/users/${id}`, headers);
    }
    return user_ids;
  }
);
export default deleteUsers;
