/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Select, {

  type StylesConfig,
} from "react-select";
// If you have a theme context, import it here
// import { useTheme } from "../../context/ThemeContext";

type OptionType = {
  label: string;
  value: string | number;
};

interface CustomeSelectProps {
  name: string;
  label?: string;
  isMulti?: boolean;
  options: OptionType[];
  placeholder?: string;
  onChange?: (selected: any) => void;
  value?: OptionType | OptionType[] | null;
  error?: string;
  theme?: "light" | "dark";
  size?: "sm" | "md" | "lg" | "xl";
  // ...other react-select props can be added here as needed
}

const getOptionBackground = (theme: string, isFocused: boolean) => {
  if (isFocused) {
    return theme === "dark" ? "#374151" : "#f0f0f0";
  }
  return theme === "dark" ? "#374151" : "#ffffff";
};

const getControlStyle = (theme: string) => (provided: any) => ({
  ...provided,
  backgroundColor: theme === "dark" ? "#374151" : "#ffffff",//changed color issue 31.3ticket
  color: theme === "dark" ? "#ffff00" : "#000000",
  borderColor: theme === "dark" ? "#444" : "#ccc",
});

const getSingleValueStyle = (theme: string) => (provided: any) => ({
  ...provided,
  color: theme === "dark" ? "#ffffff" : "#000000",
});

const getOptionStyle = (theme: string) => (provided: any, state: { isFocused: boolean }) => ({
  ...provided,
  backgroundColor: getOptionBackground(theme, state.isFocused),
  color: theme === "dark" ? "#ffffff" : "#374151",
});

const getMenuStyle = (theme: string) => (provided: any) => ({
  ...provided,
  backgroundColor: theme === "dark" ? "#374151" : "#ffffff",
});

const getInputStyle = (theme: string) => (provided: any) => ({
  ...provided,
 
  color: theme === "dark" ? "#ffffff" : "#374151",
});

const getPlaceholderStyle = (theme: string) => (provided: any) => ({
  ...provided,
   margin: 0,
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  color: theme === "dark" ? "#aaaaaa" : "#888888",
 
});

const getMultiValueStyle = (theme: string) => (provided: any) => ({
  ...provided,
  backgroundColor: theme === "dark" ? "#222" : "#eee",
});

const getMultiValueLabelStyle = (theme: string) => (provided: any) => ({
  ...provided,
  color: theme === "dark" ? "#fff" : "#000",
});

const getMultiValueRemoveStyle = (theme: string) => (provided: any) => ({
  ...provided,
  color: theme === "dark" ? "#fff" : "#000",
  ":hover": {
    backgroundColor: theme === "dark" ? "#444" : "#ccc",
    color: theme === "dark" ? "#fff" : "#000",
  },
});

const sizeStyles: Record<string, React.CSSProperties> = {
  sm: { minHeight: 32, fontSize: 12, width: "160px" },
  md: { maxHeight: 80, fontSize: 14, width: "220px" },
  lg: { minHeight: 48, fontSize: 16, width: "320px" },
  xl: { minHeight: 56, fontSize: 18, width: "420px" },
};

const CustomeSelect: React.FC<CustomeSelectProps> = ({
  name,
  label,
  isMulti = false,
  options,
  placeholder = "Select...",
  onChange,
  value,
  error,
  theme = "light",
  size = "md",
  ...rest
}) => {
  // If you use a theme context, replace theme prop with context value
  // const { theme } = useTheme();

  const customStyles: StylesConfig<OptionType, boolean> = {
    control: (provided) => ({
      ...getControlStyle(theme)(provided),
      ...sizeStyles[size],
    }),
valueContainer: (provided) => ({
  ...provided,
  paddingTop: 0,
  paddingBottom: 0,
  display: "flex",
  alignItems: "center",
}),
    singleValue: getSingleValueStyle(theme),
    option: getOptionStyle(theme),
    menu: getMenuStyle(theme),
    input: getInputStyle(theme),
    placeholder: getPlaceholderStyle(theme),
    multiValue: getMultiValueStyle(theme),
    multiValueLabel: getMultiValueLabelStyle(theme),
    multiValueRemove: getMultiValueRemoveStyle(theme),
  };

  return (
    <div className="mb-4 admin-ui">
      {label && (
        <label
          className={`block mb-1 text-sm admin-ui ${theme === "dark" ? "text-white" : "text-gray-800"} ${error ? "text-red-600" : ""}`}
          htmlFor={name}
        >
          {label}
        </label>
      )}
      <Select
        inputId={name}
        isMulti={isMulti}
        options={options}
        placeholder={placeholder}
        classNamePrefix="react-select"
        value={value}
        onChange={onChange}
        styles={customStyles}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default CustomeSelect;
