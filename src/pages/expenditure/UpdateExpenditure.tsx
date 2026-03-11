import { Button } from "@headlessui/react";
import Input from "components/Input";
import { showToast } from "components/Toaster";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import httpClient from "services/network/httpClient";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";

const schema = yup.object().shape({
  status: yup
    .string()
    .required("Status is required")
    .notOneOf(["PENDING"], "Status cannot be set back to Pending"),
  amount: yup.number().optional(),
  approvedAmount: yup
    .number()
    .required("Approved Amount is required")
    .typeError("Approved Amount  is required")
    .min(1, "Approve Amount must be greater than 0")
    //.nonNullable()
    .max(yup.ref("amount"), "This should be less than or equal to Amount"),
  differenceAmount: yup.number().optional(),
  comment: yup
    .string()
    .optional()
    .max(30, "Comment cannot exceed 30 characters"),
});

interface ExpenditureProps {
  id: number;
  amount: number;
  amountUnit: string;
  spentDate: string | number | Date;
  submitDate: string | number | Date;
  reimbursementType: string;
  description: string;
  status: string;
  //   imageUrls: string[];
  clientName: string;
  approvedAmount?: number;
  differenceAmount?: number;
  comment?: string;
}
interface UpdateExpenditureProps {
  editData: ExpenditureProps;
  onClose: () => void;
  reload: () => void;
}
const UpdateExpenditure = ({
  editData,
  onClose,
  reload,
}: UpdateExpenditureProps) => {
  let differenceAmount;

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      ...editData,
      status: editData.status || "",
      differenceAmount: differenceAmount || 0,
    },
  });

  const submit = (data: any) => {
    console.log("Update Expenditure Data:", data);

    httpClient
      .put(`reimbursements/${data.id}/admin`, data)
      .then((response) => {
        console.log("Update response:", response);
        if (response.success) {
          reload(); // Call the reload function to refresh the data
          showToast(`Expenditure successfully ${data.status} `, "success");
        } else {
          showToast("Failed to update expenditure", "error");
        }
      })
      .catch((error) => {
        console.error("Update error:", error);
        showToast("Failed to update expenditure", "error");
      })
      .finally(() => {
        onClose();
      });
  };
  useEffect(() => {
    // When editData changes, reset the form with new default values including status
    methods.reset({
      ...editData,
      status: editData.status || "",
    });
  }, [editData, methods]);
  const data1 = [
    // Removed PENDING option as it's not allowed when editing
    { value: "PENDING", label: "PENDING" },
    { value: "APPROVED", label: "APPROVED" },
    { value: "REJECTED", label: "REJECTED" },
  ];
  const approvedAmount = methods.watch("approvedAmount");

  useEffect(() => {
    const diff = Number(editData.amount) - Number(approvedAmount || 0);
    methods.setValue("differenceAmount", diff);
  }, [approvedAmount, editData.amount, methods]);

 // const isDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;

  const isDark = document.documentElement.classList.contains("dark");
  const customSelectStyles = {
    control: (base: any, state: { isFocused: any }) => ({
      ...base,
      backgroundColor: isDark ? "#4B5563" : "#ffffff", // dark:bg-gray-600
      borderColor: state.isFocused ? "#3B82F6" : "#D1D5DB",
      boxShadow: state.isFocused ? "0 0 0 1px #3B82F6" : undefined,
      "&:hover": {
        borderColor: "#3B82F6",
      },
      color: isDark ? "#ffffff" : "#000000",
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: isDark ? "#1F2937" : "#ffffff", // dark:bg-gray-800
      color: isDark ? "#ffffff" : "#000000",
    }),
    singleValue: (base: any) => ({
      ...base,
      color: isDark ? "#ffffff" : "#000000",
    }),
    option: (base: any, { isFocused, isSelected }: any) => ({
      ...base,
      backgroundColor: isSelected
        ? "#3B82F6"
        : isFocused
          ? isDark
            ? "#374151"
            : "#E5E7EB"
          : isDark
            ? "#1F2937"
            : "#ffffff",
      color: isSelected ? "#ffffff" : isDark ? "#ffffff" : "#000000",
    }),
  };

  const customTheme = (theme: any) => ({
    ...theme,
    borderRadius: theme.borderRadius,
    spacing: theme.spacing,
    colors: {
      ...theme.colors,
      neutral0: isDark ? "#4B5563" : "#fff", // control background
      neutral80: isDark ? "#fff" : "#000", // selected text
      primary25: isDark ? "#374151" : "#E5E7EB", // hover
      primary: "#3B82F6", // selected
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submit)} className="w-full">
        <section className="p-4 w-full grid grid-cols-4 gap-4">
          <Input
            name={"clientName"}
            label={"Client Name"}
            className="col-span-2 disabled:bg-white disabled:text-[#374151]  dark:disabled:bg-[#374151] dark:disabled:text-white"
            disabled
          ></Input>
          <Input
            name={"amount"}
            label={"Amount"}
            type="number"
            disabled
            className="w-full disabled:bg-white disabled:text-[#374151]  dark:disabled:bg-[#374151] dark:disabled:text-white"
          ></Input>
          <Input name={"amountUnit"} label={"Amount Unit"} disabled></Input>
          <Input
            name={"spentDate"}
            label={"Spent Date"}
            type="date"
            disabled
          ></Input>
          <Input
            name={"submitDate"}
            label={"Submit Date"}
            type="date"
            disabled
          ></Input>
          <Input
            name={"reimbursementType"}
            label={"Category Type"}
            disabled
          ></Input>
          <Input name={"description"} label={"Description"} disabled></Input>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select Status
            </label>
            
            <Select
              styles={customSelectStyles}
              theme={customTheme}
              options={data1}
              placeholder="Select Status"
              className="w-full rounded-md border border-gray-300 dark:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(selectedOption) => {
                methods.setValue("status", selectedOption?.value || "", {
                  shouldValidate: true,
                });
              }}
              value={
                data1.find(
                  (option) => option.value === methods.watch("status")
                ) || null
              }
              menuPlacement="auto"
              maxMenuHeight={200}
              isSearchable={false}
              classNamePrefix="react-select"
            />
            
            {methods.formState.errors.status ? (
              <span className="text-red-500 text-sm mt-1">
                {methods.formState.errors.status.message}
              </span>
            ) : (
              <span className="text-gray-500 text-sm mt-1 invisible">Status cannot be set back to Pending</span>
            )}
          </div>

          <div className="mb-4">
            <Input
              name={"approvedAmount"}
              label={"Approved Amount"}
              type="number"
              required
              aria-invalid={
                methods.formState.errors.approvedAmount ? "true" : "false"
              }
              aria-errormessage="approvedAmount-error"
              // onChange={(e) => {
              //   const value = parseFloat(e.target.value);
              //   methods.setValue("approvedAmount", value, {
              //     shouldValidate: true,
              //   });
              // }}
            ></Input>
            {/* <div
              id="approvedAmount-error"
              style={{ minHeight: "20px" }}
              className="text-red-500 text-sm mt-1"
            >
              {methods.formState.errors.approvedAmount
                ? methods.formState.errors.approvedAmount.message
                : "\u00A0"}
            </div> */}
          </div>
          <Input
            name={"differenceAmount"}
            label={"Difference Amount"}
            type="number"
            disabled
          ></Input>
          <Input name={"comment"} label={"Comment"} max={30} placeholder="Enter comment (max 30 char)"></Input>
        </section>
        <div className="flex justify-end p-4">
          <Button
            type="submit"
            color="blue"
            className={
              "bg-blue-400 py-2 px-6 rounded-md hover:bg-blue-700 hover:delay-75"
            }
          >
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
export default UpdateExpenditure;
