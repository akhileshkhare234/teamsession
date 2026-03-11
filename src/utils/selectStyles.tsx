import React from "react";

/**
 * Generate custom styles for React Select components based on dark mode
 * @param isDarkMode boolean indicating if dark mode is active
 * @returns customized styles for React Select
 */
export const getCustomSelectStyles = (isDarkMode: boolean) => ({
  control: (base: any, state: { isFocused: any }) => ({
    ...base,
    minHeight: "39px",
    height: "43px",
    backgroundColor: isDarkMode ? "#4B5563" : "#ffffff",
    borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
    boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : undefined,
    "&:hover": {
      borderColor: "#3B82F6",
    },
    color: isDarkMode ? "#ffffff" : "#000000",
    display: "flex",
    alignItems: "center",
  }),
  valueContainer: (provided: any) => ({
    ...provided,
    padding: "0 8px", // Reduced vertical padding
    height: "39px", // Adjusted to match control height minus borders
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }),
  input: (provided: any) => ({
    ...provided,
    margin: "0",
    padding: "0",
    color: isDarkMode ? "#F9FAFB" : "#000000",
    textAlign: "center",
  }),
  indicatorsContainer: (provided: any) => ({
    ...provided,
    height: "39px",
    alignItems: "center",
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    padding: "8px",
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: isDarkMode ? "#1F2937" : "#ffffff",
    color: isDarkMode ? "#ffffff" : "#000000",
    zIndex: 1000,
  }),
  singleValue: (base: any) => ({
    ...base,
    color: isDarkMode ? "#ffffff" : "#000000",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "90%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "center",
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: isDarkMode ? "#9CA3AF" : "#6B7280",
    position: "relative",
    top: "20%",
    left: "40%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
  }),
  option: (base: any, { isFocused, isSelected }: any) => ({
    ...base,
    backgroundColor: isSelected
      ? "#3B82F6"
      : isFocused
        ? isDarkMode
          ? "#374151"
          : "#E5E7EB"
        : isDarkMode
          ? "#1F2937"
          : "#ffffff",
    color: isSelected ? "#ffffff" : isDarkMode ? "#ffffff" : "#000000",
    padding: "10px 12px", // More compact options
    fontSize: "14px", // Match Input text size
    textAlign: "center", // Center option text
  }),
});

/**
 * Generate custom theme for React Select components based on dark mode
 * @param isDarkMode boolean indicating if dark mode is active
 * @param theme the default theme from React Select
 * @returns customized theme for React Select
 */
export const getCustomTheme = (isDarkMode: boolean) => (theme: any) => ({
  ...theme,
  borderRadius: 5,
  colors: {
    ...theme.colors,
    neutral0: isDarkMode ? "#4B5563" : "#fff", // control background
    neutral80: isDarkMode ? "#fff" : "#000", // selected text
    primary25: isDarkMode ? "#374151" : "#E5E7EB", // hover
    primary: "#3B82F6", // selected
  },
});

/**
 * Hook to get the current dark mode status from localStorage or system preference
 * @returns boolean indicating if dark mode is active
 */
export const useDarkMode = (): boolean => {
  const [isDarkMode, setIsDarkMode] = React.useState<boolean>(
    localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia?.("(prefers-color-scheme: dark)")?.matches) ||
      false
  );

  React.useEffect(() => {
    const updateDarkMode = () => {
      const theme = localStorage.getItem("theme");
      if (theme === "dark") {
        setIsDarkMode(true);
      } else if (theme === "light") {
        setIsDarkMode(false);
      } else {
        setIsDarkMode(
          window.matchMedia?.("(prefers-color-scheme: dark)")?.matches || false
        );
      }
    };

    // Initial setup
    updateDarkMode();

    // Watch for theme changes in local storage
    const observer = new MutationObserver(() => {
      updateDarkMode();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return isDarkMode;
};
