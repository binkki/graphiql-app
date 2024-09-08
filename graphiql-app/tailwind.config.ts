import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      scrollBehavior: {
        smooth: "smooth",
      fontSize: {
        base: "16px",
      },
    },
  },
  plugins: [],
} satisfies Config;
