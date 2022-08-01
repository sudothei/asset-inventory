import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import requestPassForm from "thunks/requestPassForm";
import User from "types/User";

const registerSlice = createSlice({
  name: "register",
  initialState: {} as User,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      requestPassForm.fulfilled,
      (state, action: PayloadAction<User>): User => {
        return action.payload;
      }
    );
  },
});

export default registerSlice.reducer;
