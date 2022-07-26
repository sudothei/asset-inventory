const BASE_URL = `${process.env.SERVER_HOSTNAME}:${process.env.API_PORT}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import User from "types/User";
import UserPermissions from "types/UserPermissions";
import axios from "axios";

const editUser = createAsyncThunk("users/editUser", async (user: User) => {
  const user_perms: UserPermissions = {
    admin: user.admin,
    write: user.write,
  };
  await axios.put(`http://${BASE_URL}/users/${user._id.$oid}`, user_perms);
  const newUser: User = user;
  return newUser;
});
export default editUser;
