import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import getAssets from "thunks/getAssets";
import addAsset from "thunks/addAsset";
import editAsset from "thunks/editAsset";
import deleteAssets from "thunks/deleteAssets";
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
      )
      .addCase(
        editAsset.fulfilled,
        (state: Asset[], action: PayloadAction<Asset>) => {
          const newAsset: Asset = action.payload;
          const newState: Asset[] = [
            ...state.filter((x) => x._id.$oid !== newAsset._id.$oid),
          ];
          newState.push(newAsset);
          return newState;
        }
      )
      .addCase(
        deleteAssets.fulfilled,
        (state: Asset[], action: PayloadAction<readonly string[]>) => {
          const newState: Asset[] = [
            ...state.filter((x) => !action.payload.includes(x._id.$oid)),
          ];
          return newState;
        }
      );
  },
});

export default assetsSlice.reducer;
