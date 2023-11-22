/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "theme/layouts/*.liquid",
    "theme/templates/**/*.liquid",
    "theme/sections/*.liquid",
    "theme/snippets/*.liquid",
    "theme/components/*.{liquid,js,ts}",
    "theme/assets/scripts/*.{ts,js}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
