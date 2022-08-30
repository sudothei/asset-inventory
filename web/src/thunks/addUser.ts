const BASE_URL = `${process.env.SERVER_HOSTNAME}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import UserRequest from "types/UserRequest";
import User from "types/User";
import axios from "axios";

const addUser = createAsyncThunk("users/addUser", async (user: UserRequest) => {
  const headers = {
    headers: {
      Authorization: "bearer " + localStorage.getItem("token"),
    },
  };
  const response = await axios.post(`http://${BASE_URL}/users`, user, headers);
  try {
    axios.get(`http://${BASE_URL}/password/${user.email}`);
  } catch {}
  const newUser: User = { _id: response.data, status: "Pending", ...user };
  return newUser;
});
export default addUser;
