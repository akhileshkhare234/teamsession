// components/OutlineButton.tsx
import React from "react";

interface OutlineButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  loading?: boolean;
}

const OutlineButton: React.FC<OutlineButtonProps> = ({
  onClick,
  children,
  className = "",
  disabled = false,
  loading = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`border border-radius-50 border-blue-600  rounded-full text-blue-500 bg-transparent rounded-lg px-4 py-2 hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out ${className} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default OutlineButton;
