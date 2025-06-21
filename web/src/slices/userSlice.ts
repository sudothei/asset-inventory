import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import requestPassForm from "thunks/requestPassForm";
import User from "types/User";

const userSlice = createSlice({
  name: "user",
  initialState: {} as User,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      requestPassForm.fulfilled,
      (state, action: PayloadAction<User>) => {
        return action.payload;
      }
    );
  },
});

export default userSlice.reducer;
