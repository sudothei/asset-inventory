import { configureStore } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import assetsReducer from "reducers/assetsReducer";

const store = configureStore({
  reducer: {
    assets: assetsReducer,
  },
  middleware: [thunk],
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
