import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getAssets from "thunks/getAssets";
import addAsset from "thunks/addAsset";
import Asset from "types/Asset";

const assetsSlice = createSlice({
  name: "assets",
  initialState: [] as Asset[],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAssets.fulfilled, (state, action: PayloadAction<Asset[]>) => {
        return action.payload;
      })
      .addCase(
        addAsset.fulfilled,
        (state: Asset[], action: PayloadAction<Asset>) => {
          const newAsset: Asset = action.payload;
          const newState: Asset[] = [...state];
          newState.push(newAsset);
          return newState;
        }
      );
  },
});

export default assetsSlice.reducer;
