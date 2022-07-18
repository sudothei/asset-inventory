import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getAssets from "thunks/getAssets";
import Asset from "types/Asset";

const assetsSlice = createSlice({
  name: "assets",
  initialState: [] as Asset[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      getAssets.fulfilled,
      (state, action: PayloadAction<Asset[]>) => {
        return action.payload;
      }
    );
  },
});

export default assetsSlice.reducer;
