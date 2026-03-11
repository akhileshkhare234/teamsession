const flowbite = require("flowbite-react/tailwind");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
  safelist: [
    "text-custom",
    // Responsive safelist classes
    "sm:flex",
    "md:flex",
    "lg:flex",
    "sm:hidden",
    "md:hidden",
    "lg:hidden",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      zIndex: {
        100: "100",
        // Add more z-index values for better stacking on mobile
        200: "200",
        1000: "1000",
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
      },
      maxWidth: {
        "screen-sm": "640px",
        "screen-md": "768px",
        "screen-lg": "1024px",
        "screen-xl": "1280px",
      },
      colors: {
        primary: "#1E3A8A", // Change this to your desired primary color
        secondary: "#FBBF24", // Change this to your desired secondary color
        accent: "#4B5563", // Change this to your desired accent color
        backgroundPrimary: "dark:bg-gray-800", // Change this to your desired background color
      },
      fontFamily: {
        inter: ["Inter"],
        serif: ["Merriweather", "serif"],
        mono: ["Fira Code", "monospace"],
      },
      fontSize: {
        14: "14px",
        16: "16px",
        18: "18px",
        // Add responsive text sizes
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      lineHeight: {
        100: "100%",
        // Add more line height options for better readability on different devices
        tight: "1.25",
        relaxed: "1.625",
        loose: "2",
      },
      letterSpacing: {
        normal: "0",
        wide: "0.05em",
      },
    },
  },
  plugins: [
    flowbite,
    function ({ addUtilities }) {
      addUtilities(
        {
          ".text-custom": {
            fontFamily: "Inter, sans-serif",
            fontWeight: "400",
            fontSize: "14px",
            letterSpacing: "0px",
            lineHeight: "100%",
          },
          // Add responsive container utility
          ".responsive-container": {
            width: "100%",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            marginLeft: "auto",
            marginRight: "auto",
            "@screen sm": {
              maxWidth: "640px",
            },
            "@screen md": {
              maxWidth: "768px",
            },
            "@screen lg": {
              maxWidth: "1024px",
            },
            "@screen xl": {
              maxWidth: "1280px",
            },
          },
        },
        ["responsive"]
      );
    },
  ],
};
