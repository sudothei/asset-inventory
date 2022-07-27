import { configureStore } from "@reduxjs/toolkit";
import assetsReducer from "slices/assetsSlice";
import usersReducer from "slices/usersSlice";
import userReducer from "slices/userSlice";

const store = configureStore({
  reducer: {
    assets: assetsReducer,
    users: usersReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
