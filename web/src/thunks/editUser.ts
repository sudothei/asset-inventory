const BASE_URL = `${process.env.API_HOSTNAME}:${process.env.API_PORT}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import User from "types/User";
import axios from "axios";

const editUser = createAsyncThunk("users/editUser", async (user: User) => {
  await axios.put(`http://${BASE_URL}/users/${user._id.$oid}`, user);
  const newUser: User = user;
  return newUser;
});
export default editUser;
