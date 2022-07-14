import Asset from "types/Asset";
import { AnyAction } from "redux";
const INITIAL_STATE: Asset[] = [];

export interface AssetAction extends AnyAction {
  type: string;
  asset?: Asset;
}

export default function assetsReducer(
  state = INITIAL_STATE,
  action: AssetAction
) {
  switch (action.type) {
    case "GET_ASSETS":
      return { ...state };
    default:
      return state;
  }
}
