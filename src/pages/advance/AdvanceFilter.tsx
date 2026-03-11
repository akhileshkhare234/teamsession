/* eslint-disable react-hooks/exhaustive-deps */
import Button from "components/button/Button";
import Input from "components/Input";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import {
  getCustomSelectStyles,
  getCustomTheme,
  useDarkMode,
} from "utils/selectStyles";

const schema = yup.object().shape({
  fromTimestamp: yup.string().optional(),
  toTimestamp: yup.string().optional(),
  userId: yup.string().trim().optional(),
  isSettlement: yup.string().trim().optional(),
  createdByAdmin: yup.string().trim().optional(),
});

interface FilterData {
  submit: (data: any) => void;
  buttonName?: string;
  loading?: boolean;
  hideUserField?: boolean;
  userId?: string;
}

const AdvanceFilter = ({
  submit,
  buttonName = "Apply Filters",
  loading,
  //   hideUserField = false,
  userId = "",
}: FilterData) => {
  const isDarkMode = useDarkMode();
  const customSelectStyles = getCustomSelectStyles(isDarkMode);
  const customTheme = getCustomTheme(isDarkMode);
  

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fromTimestamp: "",
      toTimestamp: "",
      userId: userId,
      isSettlement: "",
      createdByAdmin: "",
    },
    mode: "onChange",
  });
  //This watches all form values and triggers re-render on change
  const formValues = methods.watch();
  //Detect when any filter except userId has a non-empty value
  React.useEffect(() => {
  const isActive = Object.entries(formValues).some(([key, value]) => {
    if (key === "userId") return false; // userId shouldn't activate button
    return value !== "" && value !== null && value !== undefined;
  });
  setHasActiveFilters(isActive); //Update Apply button state
}, [formValues]);
//Track whether filters are active (to enable/disable Apply button)
  const [hasActiveFilters, setHasActiveFilters] = React.useState(false);

const fromDateValue = methods.watch("fromTimestamp");
  // Reset form to empty values (except userId)
  const handleReset = () => {
    methods.reset({
      fromTimestamp: "",
      toTimestamp: "",
      userId: userId,
      isSettlement: "",
      createdByAdmin: "",
    });
    setHasActiveFilters(false); // After reset, disable Apply button
  };

  const settlementOptions = [
    { value: "", label: "All" },
    { value: "true", label: "Settlement" },
    { value: "false", label: "Advance" },
  ];

  const createdByOptions = [
    { value: "", label: "All" },
    { value: "true", label: "Admin" },
    { value: "false", label: "User" },
  ];

  return (
    <div className="p-1">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <div className="flex flex-col">
              {/* <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Date Range
              </label> */}
              <div className="grid grid-cols-2 gap-2">
                <Input
                  name="fromTimestamp"
                  type="date"
                  placeholder="From Date"
                  label="From Date"
                  className="h-9 text-sm bg-white dark:bg-[#4B5563] text-black dark:text-white"
                />
                
                <Input
                  name="toTimestamp"
                  type="date"
                  placeholder="To Date"
                  label="To Date"
                 className="h-9 text-sm bg-white dark:bg-[#4B5563] text-black dark:text-white"
                  min={fromDateValue} // Ensure toDate is not before fromDate
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entry Type
              </label>
              <Select
                styles={customSelectStyles}
                theme={customTheme}
                options={settlementOptions}
                placeholder="All"
                className="w-full text-sm"
                onChange={(selectedOption) => {
                  methods.setValue(
                    "isSettlement",
                    selectedOption?.value || "",
                    {
                      shouldValidate: true,
                    }
                  );
                }}
                value={
                  settlementOptions.find(
                    (option) => option.value === methods.watch("isSettlement")
                  ) || settlementOptions[0]
                }
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Added By
              </label>
              <Select
                styles={customSelectStyles}
                theme={customTheme}
                options={createdByOptions}
                placeholder="All"
                className="w-full text-sm"
                onChange={(selectedOption) => {
                  methods.setValue(
                    "createdByAdmin",
                    selectedOption?.value || "",
                    {
                      shouldValidate: true,
                    }
                  );
                }}
                value={
                  createdByOptions.find(
                    (option) => option.value === methods.watch("createdByAdmin")
                  ) || createdByOptions[0]
                }
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Clear All
            </button>
            <Button
              //   type="submit" Disable when loading OR no active filters-T1650
              disabled={loading || !hasActiveFilters} 
              className={`text-sm px-4 py-1.5 h-8 ${
                loading  || !hasActiveFilters ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Applying..." : buttonName}
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default AdvanceFilter;
