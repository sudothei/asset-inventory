import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getUsers from "thunks/getUsers";
import deleteUsers from "thunks/deleteUsers";
import User from "types/User";

const usersSlice = createSlice({
  name: "users",
  initialState: [] as User[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        return action.payload;
      })
      .addCase(
        deleteUsers.fulfilled,
        (state: User[], action: PayloadAction<readonly string[]>) => {
          const newState: User[] = [
            ...state.filter((x) => !action.payload.includes(x._id.$oid)),
          ];
          return newState;
        }
      );
  },
});

export default usersSlice.reducer;