import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        grow: {
          '0%': { width: '0%' },
          '25%': { width: '10rem' },
          '50%': { width: '20rem' },
          '75%': { width: '10rem' },
          '100%': { width: '0%' },
        },
        growMobile: {
          '0%': { width: '0%' },
          '25%': { width: '8rem' },
          '50%': { width: '15rem' },
          '75%': { width: '8rem' },
          '100%': { width: '0%' },
        },
      },
      animation: {
        grow: 'grow 1s linear infinite',
        growMobile: 'growMobile 1s linear infinite',
      },
    },
  },
  plugins: [
    require("@designbycode/tailwindcss-text-stroke"),
  ],
} satisfies Config;
