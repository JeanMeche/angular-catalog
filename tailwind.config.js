module.exports = {
  prefix: "",
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        secondary: "var(--secondary-color)",
        third: "var(--third-color)",
        seLifeGreen: "var(--se-life-green)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
