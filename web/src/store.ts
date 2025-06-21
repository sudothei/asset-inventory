import { configureStore } from "@reduxjs/toolkit";
import assetsReducer from "slices/assetsSlice";
import usersReducer from "slices/usersSlice";
import registerReducer from "slices/registerSlice";

const store = configureStore({
  reducer: {
    assets: assetsReducer,
    users: usersReducer,
    register: registerReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
