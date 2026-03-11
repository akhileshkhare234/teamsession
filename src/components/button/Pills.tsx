import React from "react";

interface PillButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset" | undefined;
  variant?: "primary" | "secondary" | "dark" | "basic";
  size?: "sm" | "md" | "lg" | "xl";
  style?: React.CSSProperties;
  ref?: React.Ref<HTMLButtonElement>;
}

const PillButton: React.FC<PillButtonProps> = ({
  onClick,
  children,
  className = "",
  disabled = false,
  type = "button",
  variant = "dark",
  size = "md",
  style,
  ref,
}) => {
  // Define variant styles
  const variantStyles = {
    primary:
      "rounded-full bg-[#043A53] text-white border-gray-800 text-gray-800 hover:bg-gray-600 hover:text-white dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-black",
    secondary:
      "rounded-full  bg-[#F0B73F] text-gray-800 font-bold opacity-900 border-gray-500 text-gray-500 hover:bg-gray-500 hover:text-white dark:border-gray-400 dark:text-gray-800 dark:hover:bg-gray-400 dark:hover:text-black",
    dark: "rounded-full  hover:shadow-lg hover:text-gray-300 dark:bg-gray-900 dark:border-gray-900 dark:text-gray-300 dark:hover:text-white",
    // basic:
    //   "rounded-full text-gray-800 hover:shadow-lg hover:text-gray-600 dark:text-white dark:hover:text-gray-300",
    basic:
      "px-5 py-2  h-[32px] flex items-center justify-between border text-[11px] border dark:border-gray-600 font-normal rounded-lg",
  };

  // Define size styles
  const sizeStyles = {
    sm: "p-1 px-4 text-sm",
    md: "p-2 px-5 text-base",
    lg: "p-4 px-6 text-base",
    xl: "p-6 px-8 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      ref={ref}
      className={`border transition duration-300 ease-in-out w-[96px] h-[32px]  font-medium text-sm p-1 flex items-center justify-center
        ${variantStyles[variant]} ${sizeStyles[size]} 
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}`}
    >
      {children}
    </button>
  );
};

export default PillButton;
