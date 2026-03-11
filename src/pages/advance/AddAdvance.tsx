import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import httpClient from "services/network/httpClient";
import { showToast } from "components/Toaster";
import PillButton from "components/button/Pills";

type AdvanceFormValues = {
  userId: string;
  amount: number;
  description: string;
  isSettlement: boolean; // Added for the payment type selection
  createdByAdmin: boolean; // Added to indicate if the request is created by an admin
};

type Option = {
  label: string;
  value: string;
};

export default function AddAdvance({
  onClose,
  onSuccess,
  updateData = null,
  minAmount,
  maxAmount,
  maxDescriptionLength,
}: {
  onClose: () => void;
  onSuccess: () => void;
  updateData: any;
  minAmount: number;
  maxAmount: number;
  maxDescriptionLength: number;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdvanceFormValues>();
  const [emailData, setEmailData] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  console.log("AddAdvance component rendered with updateData:", updateData);
  const getEmployeData = () => {
    setLoading(true);
    httpClient
      .get("employees/all?page=1&size=2000")
      .then((res: any) => {
        const emailOptions = res.value.contents.map((emp: any) => ({
          value: emp.id,
          label: emp.firstName,
        }));
        setEmailData(emailOptions);
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getEmployeData();
  }, []);

  // useEffect(() => {
  //   if (updateData && emailData.length > 0) {
  //     reset({
  //       userId: String(updateData.userId),
  //       amount: Number(updateData.totalAdvance),
  //       isSettlement: updateData.isSettlement ? "true" : "false", // Set the payment type
  //       description: updateData.description || "",
  //     });
  //   }
  // }, [updateData, emailData, reset]);

  const onSubmit = (data: AdvanceFormValues) => {
    const payload = {
      userId: Number(data.userId),
      amount: Number(data.amount),
      description: data.description || "",
      isSettlement: false, // Convert string to boolean
      createdByAdmin: true,
    };

    const request = updateData
      ? httpClient.put(`/advances/update`, payload)
      : httpClient.post("/advances/add", payload);
    request
      .then((response) => {
        if (response.success) {
          showToast(
            updateData
              ? "Advance updated successfully"
              : "Advance added successfully",
            "success"
          );
          reset(); // reset form
          onSuccess();
        } else {
          showToast(
            response?.error?.message || updateData
              ? "Failed to update advance"
              : " Failed to add advance",
            "error"
          );
        }
      })
      .catch((error) => {
        console.error("Failed to add/update advance:", error);
        showToast("Something went wrong", "error");
      })
      .finally(() => {
        onClose();
      });
  };

  return (
    <div className="space-y-4 w-full md:grid gap-4  overflow-y-auto ">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {loading && <div>Loading...</div>}
        {/* <div>
          <label className="block text-sm font-medium mb-1">Payment Type</label>
          <select
            {...register("isSettlement", {
              required: "Please select payment type",
            })}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-sm"
          >
            <option value="">-- Select Payment Type --</option>
            <option value="false">Advance Payment</option>
            <option value="true">Settlement</option>
          </select>
          <div style={{ minHeight: "1.25rem" }}>
            {errors.isSettlement && (
              <p className="text-red-500 text-xs mt-1">
                {errors.isSettlement.message}
              </p>
            )}
          </div>
        </div> */}

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white mt-1">
            Select Employee <span className="text-red-500">*</span>
          </label>
          <select
            disabled={!!updateData}
            {...register("userId", { required: "Please select an employee" })}
            className=" w-full p-2 border rounded text-sm
    bg-gray-50 text-black
    dark:bg-[#374151] dark:text-gray-300 "
          >
            <option value="" style={{ color: "#727986" }}>-- Select Employee --</option>
            {emailData.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div style={{ minHeight: "1.25rem" }}>
            {errors.userId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.userId.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white mt-1">
            Amount <span className="text-red-500">*</span>
          </label>
          <input
            {...register("amount", {
              required: "Amount is required",
              min: {
                value: minAmount,
                message: `Amount must be at least ${minAmount}`,
              },
              max: {
                value: maxAmount,
                message: `Amount must be less than or equal to ${maxAmount}`,
              },
              valueAsNumber: true,
            })}
            type="number"
            placeholder={`Enter amount (${minAmount} - ${maxAmount})`}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-sm "
          />
          <div style={{ minHeight: "1.25rem" }}>
            {errors.amount && (
              <p className="text-red-500 text-xs mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white mt-1">
            Description <span className="text-red-500">*</span>
          </label>
          <input
            {...register("description", {
              required: "Description is required",
              maxLength: {
                value: maxDescriptionLength,
                message: `Description cannot exceed ${maxDescriptionLength} characters`,
              },
              //space, empty field validation
              validate: (value) =>
             value.trim().length > 0 || "Description field cannot be empty",             
            })}
            type="text"
             maxLength={maxDescriptionLength} //this prevents typing beyond limit eg.,25 char
            placeholder={`Enter description (max ${maxDescriptionLength} chars)`}
            className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 text-sm "
          />
          <div style={{ minHeight: "1.25rem" }}>
            {errors.description && (
              <p className="text-red-500 text-xs mt-1">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex ml-20 p-3 items-center justify-end gap-6 ">
          <PillButton
            type="submit"
            variant="secondary"
            style={{ width: "fit-content" }}
          >
            {updateData ? "Update" : "Add"}{" "}
            {/* Show "Update" or "Add" based on whether we're updating */}
          </PillButton>

          <PillButton type="reset" onClick={onClose} variant="primary">
            Cancel
          </PillButton>
        </div>
      </form>
    </div>
  );
}
