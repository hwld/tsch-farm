import type { Config } from "tailwindcss";
import twColors from "tailwindcss/colors";

const colors = {
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
      black: twColors.black,
      white: twColors.white,
      transparent: twColors.transparent,
      gray: twColors.zinc,
      brand: colors.primary,
      lime: twColors.lime,
      yellow: twColors.yellow,
      red: twColors.red,
      purple: twColors.purple,
      teal: twColors.teal,

      border: twColors.zinc[600],
    },
  },
  plugins: [],
};
export default config;
