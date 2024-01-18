const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],

    theme: {
        extend: {
            colors: {},
            fontSize: {
                "heading-lg": "72px",
                "heading-md": "26px",
                "heading-sm": "22px",
                "body-lg": "18px",
                "body-md": "16px",
                "body-sm": "14px",
            },
            screens: {
                base: "1440px",
                xm: "900px",
                ms: "767px",
                xs: "420px",
            },
        },
    },

    plugins: [
    ],
};

