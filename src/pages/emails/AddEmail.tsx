// DynamicForm.tsx
import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import httpClient from "services/network/httpClient";
// import { useToast } from "components/Toaster";
import { showToast } from "components/Toaster";
// import PillButton from "components/button/Pills";
import Button from "components/button/Button";

type FormValues = {
  emails: { value: string }[];
};

// Email validation regex pattern
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.(com|in|org|net|edu|gov|info|co|ai)$/i;

export default function AddEmail({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  //   const { addToast } = useToast();
  const { register, control, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    defaultValues: {
      emails: [{ value: "" }],
    },
    mode: "onChange", // Validate on change for real-time validation
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emails",
  });
  
  // Watch the emails field to determine when to enable/disable buttons
  const watchedEmails = watch("emails");

  const onSubmit = (data: FormValues) => {
    console.log("Submitted Data:", data);
    const requestData: { emails: string[] } = {
      emails: [],
    };
    const emailStrings = data.emails.map((email) => email.value);
    emailStrings.forEach((email) => {
      if (email) {
        requestData.emails.push(email);
      }
    });
    const formattedEmails = emailStrings.join(", ");

    console.log("Formatted Emails:", formattedEmails);

    httpClient
      .post("/emails/add", requestData)
      .then((response) => {
        console.log("Email added successfully:", response);
        if (response.success) {
          showToast("Emails added successfully", "success");
          onSuccess(); // Call the success callback if provided
        } else {
          showToast(`Error: ${response.error.message}`, "error");
        }
        // Optionally, you can reset the form or show a success message
      })
      .catch((error) => {
        console.error("Error adding email:", error);
        // Optionally, handle the error (e.g., show an error message)
      })
      .finally(() => {
        onClose && onClose(); // Close the modal or perform any cleanup
      });
  };

  // Function to check if all emails are valid
  const isFormValid = () => {
    if (!watchedEmails || watchedEmails.length === 0) return false;
    return watchedEmails.every(email => 
      email.value && EMAIL_REGEX.test(email.value)
    );
  };

  // Function to check if the last email is valid (for enabling the "+" button)
  const isLastEmailValid = () => {
    if (!watchedEmails || watchedEmails.length === 0) return false;
    const lastEmail = watchedEmails[watchedEmails.length - 1];
    return lastEmail.value && EMAIL_REGEX.test(lastEmail.value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-center gap-2 ">
          <div className="flex-grow">
            <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900 dark:text-white aria-hidden"> 
                Email address <span className="text-red-500">*</span>
              </label>
            <input
              {...register(`emails.${index}.value`, { 
                required: "Email is required", 
                pattern: {
                  value: EMAIL_REGEX,
                  message: "Invalid email format"
                }
              })}
              
              placeholder="Enter email address"
              className={`bg-gray-50 border ${errors.emails?.[index]?.value ? 'border-red-500' : 'border-gray-300'} dark:border text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
            />
            {errors.emails?.[index]?.value && (
              <p className="text-red-500 text-xs mt-1">
                {errors.emails?.[index]?.value?.message?.toString() || "Invalid email"}
              </p>
            )}
          </div>
          {index > 0 ? (
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 whitespace-nowrap"
            >
              Delete
            </button>
          ) : (
            <div className="invisible text-red-500 whitespace-nowrap">
              Delete
            </div>
          )}
        </div>
      ))}

      {/* <div className="flex felx-row mt-2 p-2 space-x-4 gap-4 just"> */}
      <div className="flex justify-end items-center mr-14">
        <button
          type="button"
          onClick={() => append({ value: "" })}
          disabled={!isLastEmailValid()}
          className={`px-3 py-1 rounded ${isLastEmailValid() 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          +
        </button>
      </div>

      <div className="flex items-center">
        <Button
          disabled={!isFormValid()}
          className={!isFormValid() ? 'opacity-50 cursor-not-allowed' : ''}
        >
          Submit
        </Button>
      </div>
      {/* </div> */}
    </form>
  );
}
