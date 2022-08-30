const BASE_URL = `${process.env.SERVER_HOSTNAME}/api`;
import { createAsyncThunk } from "@reduxjs/toolkit";
import User from "types/User";
import UserPermissions from "types/UserPermissions";
import axios from "axios";

const editUser = createAsyncThunk("users/editUser", async (user: User) => {
  const headers = {
    headers: {
      Authorization: "bearer " + localStorage.getItem("token"),
    },
  };
  const user_perms: UserPermissions = {
    admin: user.admin,
    write: user.write,
  };
  await axios.put(
    `http://${BASE_URL}/users/${user._id.$oid}`,
    user_perms,
    headers
  );
  const newUser: User = user;
  return newUser;
});
export default editUser;
