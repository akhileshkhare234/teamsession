import Input from "components/Input";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { showToast } from "components/Toaster";
import httpClient from "services/network/httpClient";

// Define the structure for the selected user
interface User {
  userId: number;
  userName: string;
  amountPayableToUser: number;
}

// Define the context type
interface FormContext {
  selectedUser: User;
}

const schema = yup.object().shape({
  amount: yup
    .number()
    .required("Payment amount is required")
    .positive("Payment amount must be a positive number")
    .test(
      "max-amount",
      "Payment amount cannot exceed the payable amount",
      function (value) {
        // Access the selectedUser prop through the context with proper typing
        const context = this.options.context as FormContext;
        return !value || value <= context.selectedUser.amountPayableToUser;
      }
    ),
});

interface SettledAmountProps {
  selectedUser: User;
  onClose: () => void;
  onSuccess?: () => void; // Optional callback for success
}

const SettledAmount = ({
  selectedUser,
  onClose,
  onSuccess,
}: SettledAmountProps) => {
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: selectedUser.amountPayableToUser || 0,
    },
    context: { selectedUser } as FormContext, // Cast to the defined context type
  });
  const handleSubmit = (data: any) => {
    console.log("Payment Data:", data);
    const store = {
      ...data,
      isSettlement: true,
      userId: selectedUser.userId,
      createdByAdmin: true,
    };
    console.log("Payment Store:", store);
    httpClient
      .post("/advances/add", store)
      .then((response) => {
        console.log("Payment response:", response);
        if (response.success) {
          showToast("Payment submitted successfully", "success");
          onClose();
          onSuccess?.(); // Call the success callback if provided
        } else {
          // Display the specific error message from the response
          const errorMsg =
            response.error?.message || " Amount must be greater than 100";
          showToast(errorMsg, "error");
        }
      })
      .catch((error) => {
        console.error("Error submitting payment:", error);
        // Extract the error message from the response if available
        let errorMessage = "Failed to submit payment";

        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.message) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        showToast(errorMessage, "error");
      });
  };
  return (
    <div className="p-4">
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-3 rounded-md dark:bg-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Amount Payable
          </p>
          <p className="text-lg font-semibold">
            ₹{selectedUser.amountPayableToUser.toLocaleString()}
          </p>
        </div>
        <div className="bg-gray-100 p-3 rounded-md dark:bg-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-300">User</p>
          <p className="text-lg font-semibold">{selectedUser.userName}</p>
        </div>
      </div>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(handleSubmit)}
          className="space-y-4"
        >
          <div className="mb-4">
            <Input
              name="amount"
              label="Payment Amount"
              type="number"
              placeholder="Enter payment amount"
              className="w-full col-span-1 w-80 bg-white text-black dark:bg-[#374151] dark:text-white"
            ></Input>
            {/* <label className="block text-sm font-medium mb-1">
            Payment Amount
          </label>
          <input
            type="number"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            max={selectedUser.amountPayableToUser}
          /> */}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              Submit Payment
            </button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
export default SettledAmount;
