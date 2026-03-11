/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (value: string) => void;
  initialValue?: string;
  debounceTime?: number;
  className?: string;
  variant?: "default" | "minimal" | "bordered";
  size?: "small" | "medium" | "large";
  showIcon?: boolean;
  showClearButton?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialValue = "",
  debounceTime = 300,
  className = "",
  variant = "default",
  size = "medium",
  // showIcon = true,
  showClearButton = true,
  autoFocus = false,
  disabled = false,
  placeholder = "Search...",
}) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialValue);
  const [isFocused, setIsFocused] = useState<boolean>(autoFocus);
  const [expanded, setExpanded] = useState<boolean>(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  console.log(isFocused);
  const toggleExpand = () => {
    if (window.innerWidth < 640) {
      setExpanded(!expanded);
      if (!expanded && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  };
  console.log("SearchBar rendered with initialValue:", toggleExpand);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearch(value);
    }, debounceTime);
  };

  const clearSearch = () => {
    setSearchTerm("");
    onSearch("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Apply autofocus if specified
  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  // Update when initialValue changes
  useEffect(() => {
    if (initialValue !== searchTerm) {
      setSearchTerm(initialValue);
    }
  }, [initialValue]);

  // Set size classes
  const sizeClasses = {
    small: "h-8 text-sm",
    medium: "h-10 text-base",
    large: "h-12 text-lg",
  };

  // Set variant classes
  const variantClasses = {
    default:
      "bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm",
    minimal:
      "bg-transparent border-b-2 border-gray-200 dark:border-gray-700 rounded-none",
    bordered:
      "bg-transparent border-2 border-gray-300 dark:border-gray-600 rounded-lg",
  };

  // Set input width based on expansion state
  const inputWidthClass =
    expanded || window.innerWidth >= 640 ? "w-full" : "w-0 sm:w-full";

  return (
    <div
      className={`
          input-text outline-none bg-transparent w-full
          text-gray-900 dark:text-white dark:placeholder-gray-500
          focus:outline-none 
          transition-all duration-300
          ${inputWidthClass}
          ${disabled ? "cursor-not-allowed" : ""}
          relative
        `}
    >
      <div className="relative w-full">
        <input
        
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
          placeholder={placeholder}
          className={`                         
             w-full pr-8 pl-3 transition-all duration-300
             bg-white text-black placeholder-gray-400
            dark:bg-[#374151] dark:text-white dark:placeholder-gray-300      
            border border-gray-600 focus:border-gray-400
             rounded-md
            
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${expanded ? "w-full" : "w-auto"}
            ${disabled ? "opacity-60 cursor-not-allowed" : ""}
            ${className}
          `}
        />

        {/* Clear button positioned absolutely inside the input */}
        {showClearButton &&
          searchTerm &&
          (expanded || window.innerWidth >= 640) && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center justify-center focus:outline-none"
              disabled={disabled}
              aria-label="Clear search"
            >
              <FontAwesomeIcon
                icon={faTimes}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
              />
            </button>
          )}
      </div>
    </div>
  );
};

export default SearchBar;
