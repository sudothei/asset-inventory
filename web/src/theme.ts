import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9a9a9a",
    },
    secondary: {
      main: "#fc8eac",
    },
    warning: {
      main: "#f5a000",
    },
    error: {
      main: "#ff0000",
    },
  },
});

export default theme;
