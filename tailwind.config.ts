import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#010101",
        "black-opacity": {
          10: "rgba(1, 1, 1, 0.1)",
          20: "rgba(1, 1, 1, 0.2)",
          30: "rgba(1, 1, 1, 0.3)",
          40: "rgba(1, 1, 1, 0.4)",
          50: "rgba(1, 1, 1, 0.5)",
          60: "rgba(1, 1, 1, 0.6)",
          70: "rgba(1, 1, 1, 0.7)",
          80: "rgba(1, 1, 1, 0.8)",
          90: "rgba(1, 1, 1, 0.9)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
