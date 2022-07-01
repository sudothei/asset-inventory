import * as React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard"
import 'styles/index.scss';
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"
import { CssBaseline } from '@mui/material/';
import Container from '@mui/material/Container';
import TopBar from "./TopBar"

const container = document.getElementById('root')!;
const root = createRoot(container);
root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
          <TopBar/>
          <Container sx={{ paddingTop: 10 }}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Dashboard />}> </Route>
              </Routes>
            </BrowserRouter>
          </Container>
      </ThemeProvider>
  </React.StrictMode>
);
