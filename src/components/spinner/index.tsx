import React from "react";

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  color?: string;
  width?: string;
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = "medium", color = "text-gray-500", width, className = "" }) => {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-24 w-24",
  };

  const borderWidth =
    width ||
    {
      small: "border-2",
      medium: "border-4",
      large: "border-4",
    }[size];

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${borderWidth} ${color} animate-spin rounded-full border-t-transparent`}
        role="status"
      ></div>
    </div>
  );
};

export default Spinner;
