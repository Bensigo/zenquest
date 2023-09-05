/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const customTheme: ThemeConfig = extendTheme({
  initialColorMode: "light",
  useSystemColorMode: false,
  colors: {
    "sage": {
      50: "#80B6C0AF",
      100: "#b6c0af",
      200: "#aebca6",
      300: "#96a68f",
      400: "#7e9079",
      500: "#667a62",
     
    },
    primary: "#90a58a",
  },
  fontSizes: {
    small: "14px",
    medium: "16px",
    large: "20px",
  },
  fonts: {
    body: "Open Sans, Arial, sans-serif",
  },
});

export default customTheme;
