import type { Config } from "tailwindcss";
import twColors from "tailwindcss/colors";

const colors = {
  gray: {
    "50": "#f6f6f6",
    "100": "#e7e7e7",
    "200": "#d1d1d1",
    "300": "#b0b0b0",
    "400": "#888888",
    "500": "#6d6d6d",
    "600": "#5d5d5d",
    "700": "#4f4f4f",
    "800": "#454545",
    "900": "#3d3d3d",
    "950": "#262626",
  },
  primary: {
    "50": "#f2f7fd",
    "100": "#e5edf9",
    "200": "#c5d9f2",
    "300": "#91b9e8",
    "400": "#5795d9",
    "500": "#3178c6",
    "600": "#215da8",
    "700": "#1c4b88",
    "800": "#1b4171",
    "900": "#1c385e",
    "950": "#12233f",
  },
};

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      gray: colors.gray,
      brand: colors.primary,
      lime: twColors.lime,
      yellow: twColors.yellow,
      red: twColors.red,
      purple: twColors.purple,
      teal: twColors.teal,

      border: colors.gray[600],
    },
  },
  plugins: [],
};
export default config;
