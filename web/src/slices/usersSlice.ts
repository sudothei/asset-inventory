import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getUsers from "thunks/getUsers";
import deleteUsers from "thunks/deleteUsers";
import addUser from "thunks/addUser";
import editUser from "thunks/editUser";
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
        addUser.fulfilled,
        (state: User[], action: PayloadAction<User>) => {
          const newUser: User = action.payload;
          const newState: User[] = [...state];
          newState.push(newUser);
          return newState;
        }
      )
      .addCase(
        editUser.fulfilled,
        (state: User[], action: PayloadAction<User>) => {
          const newUser: User = action.payload;
          const newState: User[] = [
            ...state.filter((x) => x._id.$oid !== newUser._id.$oid),
          ];
          newState.push(newUser);
          return newState;
        }
      )
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
