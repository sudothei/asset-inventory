import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material/";

import Assets from "./views/Assets/Assets";
import Users from "./views/Users/Users";
import SetPassword from "./views/SetPassword/SetPassword";
import Login from "./views/Login/Login";
import theme from "./theme";
import "index.css";
import store from "./store";
import PrivateRoute from "components/PrivateRoute";
import AdminRoute from "components/AdminRoute";

const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={<PrivateRoute component={<Assets />} />}
            ></Route>
            <Route
              path="/Users"
              element={<AdminRoute component={<Users />} />}
            ></Route>
            <Route
              path="/setpassword/:oid/:token"
              element={<SetPassword />}
            ></Route>
            <Route path="/login" element={<Login />}></Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
