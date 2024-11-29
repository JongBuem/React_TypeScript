import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Backdrop, CircularProgress } from "@mui/material";

const theme = createTheme({
  palette: {
    secondary: {
      main: "#1974D0",
    },
  },
});

export const BasicLoading = () => {
  return (
    <Backdrop
      open={true}
      sx={{
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + -1,
      }}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export function Loading() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        justifyItems: "center",
        height: "20vh",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          justifyItems: "center",
          width: "100%",
          alignItems: "center",
        }}
      >
        <ThemeProvider theme={theme}>
          <CircularProgress color="secondary" size={60} thickness={2.5} />
        </ThemeProvider>
      </div>
    </div>
  );
}
