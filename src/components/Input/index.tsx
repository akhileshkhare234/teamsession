/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ChangeEvent } from "react";
import { useFormContext, useController } from "react-hook-form";
import * as yup from "yup";

interface InputProps {
  name: string;
  label: string;
  type?: string;
  validationSchema?: yup.AnyObjectSchema;
  placeholder?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value?: string | number;
  required?: boolean;
  disabled?: boolean;
  min?: any;
  max?: any;
  className?: string;
  onlyLetters?: boolean; 
  rules?: any;
  readOnly?: boolean;
  
}

const Input = ({
  name,
  label,
  type = "text",
  validationSchema,
  placeholder,
  onChange,
  value,
  disabled,
  required,
  min,
  max,
  

  ...rest
}: InputProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const {
  field,
  fieldState: { invalid },
} = useController({
  name,
  control,
  defaultValue: "",
  rules: rest.rules, // <-- use rules passed from parent component
});

      // validate: validationSchema
      //   ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //     async (value: any) => {
      //       try {
      //         await validationSchema.validate(value);
      //         return true;
      //       } catch (error: any) {
      //         return error.message;
      //       }
      //     }

     
       // : undefined,
 

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (type === "date") {
  field.onChange(e);
  if (onChange) onChange(e);
  return;
}
    let val = e.target.value;
    
//restrict special character in fields 
     if (rest.onlyLetters) {
    val = val.replace(/[^A-Za-z ]/g, "");
    e.target.value = val;  
  }

    // Block - and +
    if (val.includes("-") || val.includes("+")) {
    return;
  }

// Block spinner creating negative values and to avoid browser auto-replacing empty number fields with min/max values
  if (type === "number") {
  const raw = e.target.value;
  // Convert empty string to null (so RHF will trigger "required")
  const finalValue = raw === "" ? null : Number(raw);
  field.onChange(finalValue);
  if (onChange) onChange(e);
  return;
}
     
    let transformedValue = e.target.value;

    // Capitalize only the first character for both textarea and input
    if (type !== "email" && transformedValue.length === 1) {
      transformedValue = capitalizeFirstLetter(transformedValue);
      e.target.value = transformedValue; // Update the event target value
    }

    field.onChange(e); // Pass the event to onChange, not the transformed value directly
    if (onChange) onChange(e);
  };

  const errMessage = errors[name] ? errors[name]?.message : undefined;

  return (
    <div className="">
      <label
        htmlFor={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          {...field}
          rows={4}
          placeholder={placeholder}
          className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
            invalid
              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
              : "border-gray-300"
          }`}
          onChange={handleChange}
          value={value || field.value}
          {...rest}
        ></textarea>
      ) : (
        <input
          {...field}
          type={type}                                             
          placeholder={placeholder}
          maxLength={max} 
           //restricting entering - + e 
          onKeyDown={(e) => {
          if (e.key === "-" || e.key === "+" ) {
          e.preventDefault();
           }
            }}
          className={`bg-gray-50 border border-gray-300 dark:border  text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
            invalid
              ? "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
              : "border-gray-300"
          }`}
          onChange={handleChange}
          value={value || field.value}
          disabled={disabled ? disabled : false}
          min={min}
          max={max}
          {...rest}
        />
      )}
      {errMessage ? (
        <p className="text-red-500 mt-1 text-sm font-medium">
          {errMessage as React.ReactNode}
        </p>
      ) : (
        <p className="invisible mt-1 text-sm font-medium">
          Placeholder for error
        </p>
      )}
    </div>
  );
};

export default Input;
