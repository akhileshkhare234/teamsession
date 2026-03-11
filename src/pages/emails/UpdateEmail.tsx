import Button from "components/button/Button";
import Input from "components/Input";
import { showToast } from "components/Toaster";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import httpClient from "services/network/httpClient";

interface UpdateEmailProps {
  onClose?: () => void;
  onSuccess?: () => void;
  updateEmail: any;
}

// Define form values type for better type checking
type FormValues = {
  email: string;
  // Add other fields if they exist in updateEmail
};

// No longer using validation schema - handled entirely through custom validation

const UpdateEmail = ({ updateEmail, onClose, onSuccess }: UpdateEmailProps) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      ...updateEmail, // Assuming updateEmail contains the initial values for the form
    },
    mode: "all", // Validate on all interactions (change, blur, submit)
  });
  
  // Track form validity using state instead of relying on isValid
  const [isFormValid, setIsFormValid] = React.useState(false);
  
  // Check form validity
  useEffect(() => {
    // Validate the initial value when component mounts
    methods.trigger("email").then(isValid => {
      setIsFormValid(isValid);
      console.log("Initial validation result:", isValid);
    });
    
    // Log the initial value for debugging
    console.log("Initial email value:", updateEmail?.email);
  }, [methods, updateEmail?.email]);
  
  // Debug validation errors and update form validity
  useEffect(() => {
    const subscription = methods.watch((value) => {
      console.log("Current form values:", value);
      
      // Test the email with our regex manually and update form validity
      if (value.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.(com|in|org|net|edu|gov|info|co|ai)$/i;
        const isValidByRegex = emailRegex.test(value.email);
        console.log("Is email valid by regex:", isValidByRegex);
        
        // Update form validity state
        setIsFormValid(isValidByRegex);
      } else {
        setIsFormValid(false);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [methods]);

  const submit = (data: FormValues) => {
    console.log("Submitted Data:", data);
    
    // Get current email value directly from the form
    const emailValue = methods.getValues("email");
    console.log("Email value on submit:", emailValue);
    
    // Submit the data manually to avoid validation issues
    const submitData = { email: emailValue };
    
    httpClient
      .put(`emails/update/${updateEmail.id}`, submitData)
      .then((response) => {
        console.log("Email updated successfully:", response);
        if (response.success) {
          showToast("Email updated successfully", "success");
          onSuccess && onSuccess(); // Call the success callback if provided
          // Optionally, you can reset the form or show a success message
        } else {
          showToast(`Error: ${response.error.message}`, "error");
        }
      })
      .catch((error) => {
        console.error("Error updating email:", error);
        showToast("Something went wrong", "error");
      })
      .finally(() => {
        // if (methods.onSuccess) {
        //   methods.onSuccess(); // Call the success callback if provided
        // }
        onClose && onClose();
      });
  };

  // Create a manual submit function that bypasses validation
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValue = methods.getValues("email");
    console.log("Manual submit with email:", emailValue);
    
    // Check if valid using our regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (emailRegex.test(emailValue)) {
      // Call our submit function with the form data
      submit({ email: emailValue });
    } else {
      showToast("Please enter a valid email address", "error");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleFormSubmit} className="space-y-4">
        <div>
          <Input
            type="email" 
            name="email"
            label="Email"
            placeholder="Enter email"
            required
          />
          {/* Custom validation message */}
          {methods.getValues("email") && !isFormValid ? (
            <p className="text-red-500 text-xs ">
              Please enter a valid email format (e.g., name@domain.com)
            </p>
          ) : <p className="text-xs text-gray-500 ">
            Example: name@domain.com
          </p>}
          
        </div>
        <div className="flex justify-end">
          <Button
            disabled={!isFormValid}
            className={!isFormValid ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default UpdateEmail;
