import { ThunkAction } from "@reduxjs/toolkit";
import { AnyAction, Dispatch, ActionCreator } from "redux";
import axios from "axios";
const BASE_URL = "http://localhost:5000";

const getAssets = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async function (dispatch: ActionCreator<Dispatch>) {
    const res = await axios.get(`${BASE_URL}/api/assets`);
    const assets = res.data;
    const action = { type: "GET_ALL_POSTS", assets };
    dispatch(action);
  };
};
export default getAssets;
