/* eslint-disable react-hooks/exhaustive-deps */
import Button from "components/button/Button";
import Input from "components/Input";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import httpClient from "services/network/httpClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons";
import {
  getCustomSelectStyles,
  getCustomTheme,
  useDarkMode,
} from "utils/selectStyles";

const schema = yup.object().shape({
  fromDate: yup.string().optional(),
  toDate: yup
    .string()
    .optional()
    .test("is-after-fromDate", "To Date must be after From Date", function (value) {
      const { fromDate } = this.parent;
      if (!fromDate || !value) return true;
      return new Date(value) >= new Date(fromDate);
    }),
  month: yup.string().nullable(),
  year: yup
    .string()
    .nullable()
    .when("month", {
      is: (val: string) => !!val, // if month is selected
      then: (schema) => schema.required("Year field is required"),
      otherwise: (schema) => schema.notRequired(),
    }),
  typeId: yup.string().trim().optional(),
  status: yup.string().trim().optional(),
  userId: yup.string().trim().optional(),
});

interface FilterData {
  submit: (data: any) => void;
  buttonName?: string;
  loading?: boolean;
}
interface CatagoryProps {
  value: string;
  label: string;
}
interface CategoryResponse {
  id: string;
  name: string;
}

const Filter = ({ submit, buttonName = "Submit", loading }: FilterData & { loading: boolean }) => {
  const [categoryOptions, setCategoryOptions] = React.useState<CatagoryProps[]>(
    []
  );
  const [userData, setuserData] = React.useState<CatagoryProps[]>([]);
  const isDarkMode = useDarkMode();

  const customSelectStyles = getCustomSelectStyles(isDarkMode);
  const customTheme = getCustomTheme(isDarkMode);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;
  const formattedFirstDay = new Date(currentYear, today.getMonth(), 2)
    .toISOString()
    .split("T")[0];
  const formattedToday = today.toISOString().split("T")[0];

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fromDate: formattedFirstDay,
      toDate: formattedToday,
      month: currentMonth.toString(),
      year: currentYear.toString(),
      status: "",
      typeId: "",
      userId: "",
    },
    mode: "onChange",
  });

  //Track if any filter is active
  const [hasActiveFilters, setHasActiveFilters] = React.useState(false);
  //  Watch all fields for changes
  const formValues = methods.watch();
  // Watch individual fields
  const fromDate = methods.watch("fromDate");
  const toDate = methods.watch("toDate");
  const monthValue = methods.watch("month");
  const yearValue = methods.watch("year");
  //Detect if any filter is active (except userId)
  useEffect(() => {
    const isActive = Object.entries(formValues).some(([key, value]) => {
      if (key === "userId") return false; // userId doesn’t activate Submit button
      return value !== "" && value !== null && value !== undefined;
    });
  
    setHasActiveFilters(isActive);
  }, [formValues]);

  const handleReset = () => {
    methods.reset({
      fromDate: formattedFirstDay,
      toDate: formattedToday,
      month: currentMonth.toString(),
      year: currentYear.toString(),
      status: "",
      typeId: "",
      userId: "",
    });
  };
  // const userId = useWatch({ name: "userId", control: methods.control });
  // const typeId = useWatch({ name: "typeId", control: methods.control });
  // const status = useWatch({ name: "status", control: methods.control });
  // console.log("userId:", userId);
  const handleClearAll = () => {
    methods.reset({
      fromDate: "",
      toDate: "",
      month: "",
      year: "",
      status: "",
      typeId: "",
      userId: "",
    });
     setHasActiveFilters(false); //Disable Submit after clear
  };

  useEffect(() => {
    httpClient.get("reimbursements/alltypes").then((response: any) => {
      const types = response.value.map((item: CategoryResponse) => ({
        value: item.id,
        label: item.name,
      }));
      setCategoryOptions(types);
    });
  }, []);

  useEffect(() => {
    httpClient.get("employees/all").then((response: any) => {
      const userOptions = response.value.contents.map((user: any) => ({
        value: user.id,
        label: `${user.firstName} ${user.lastName}`,
      }));
      setuserData(userOptions);
    });
  }, []);

  const statusOptions = [
    { value: "PENDING", label: "PENDING" },
    { value: "APPROVED", label: "APPROVED" },
    { value: "REJECTED", label: "REJECTED" },
  ];

  const monthOptions = [
    { label: "January", value: "1" },
    { label: "February", value: "2" },
    { label: "March", value: "3" },
    { label: "April", value: "4" },
    { label: "May", value: "5" },
    { label: "June", value: "6" },
    { label: "July", value: "7" },
    { label: "August", value: "8" },
    { label: "September", value: "9" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" },
  ];

  // const selectCommonProps = {
  //   styles: customSelectStyles,
  //   theme: customTheme,
  //   isSearchable: true,
  //   menuPlacement: "auto",
  //   menuPosition: "fixed",
  //   maxMenuHeight: 200,
  // };

  const fromDateValue = methods.watch("fromDate");

  // If FromDate or ToDate is selected → clear & disable Month/Year
  useEffect(() => {
    if (fromDate || toDate) {
      methods.setValue("month", "", { shouldValidate: true });
      methods.setValue("year", "", { shouldValidate: true });
    }
  }, [fromDate, toDate]);
  
  // If Month or Year is selected → clear & disable FromDate/ToDate
  useEffect(() => {
    if (monthValue || yearValue) {
      methods.setValue("fromDate", "", { shouldValidate: true });
      methods.setValue("toDate", "", { shouldValidate: true });
    }
  }, [monthValue, yearValue]);

  return (
    <div
      className="
        max-w-4xl mx-auto p-2 bg-white dark:bg-gray-800 
      "
      style={{
        boxSizing: "border-box",
      }}
    >
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submit)} className=" overflow-auto">
           {(!!methods.watch("fromDate") || !!methods.watch("toDate")) && (
    <p className="text-blue-600 text-sm mb-2">
      Month and Year are disabled because a date range is selected.
    </p>
  )}

  {(!!methods.watch("month") || !!methods.watch("year")) && (
    <p className="text-blue-600 text-sm mb-2">
      Date range is disabled because Month/Year filter is selected.
    </p>
  )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              name="fromDate"
              type="date"
              placeholder="From Date"
              label="From Date"
               disabled={!!monthValue || !!yearValue}
            />
            <Input
              name="toDate"
              type="date"
              placeholder="To Date"
              label="To Date"
              min={fromDateValue || undefined}
               disabled={!!monthValue || !!yearValue}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 space-x-3">
            <div>
              <label className="block text-xs font-medium mt-2 text-gray-900 dark:text-white">
                Select Month
              </label>
              <Select
                styles={customSelectStyles}
                theme={customTheme}
                // {...selectCommonProps}
                options={monthOptions}
                placeholder="Select Month"
                 isDisabled={!!fromDate || !!toDate}
                className="w-full mt-2"
                menuPlacement="bottom" // must be one of: "auto" | "bottom" | "top"
                maxMenuHeight={150}
                onChange={(opt) =>
                  methods.setValue("month", opt?.value || "", {
                    shouldValidate: true,
                  })
                }
                value={
                  monthOptions.find(
                    (opt) => opt.value === methods.watch("month")
                  ) || null
                }
              />
            </div>
            <Input name="year" label="Year" type="text" placeholder="Enter year"  disabled={!!fromDate || !!toDate}/>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-900 dark:text-white">
                Select User
              </label>
              <Select
                styles={{
                  ...customSelectStyles,
                  singleValue: (base) => ({
                    ...base,
                    color: isDarkMode ? "#ffffff" : "#000000",
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    // overflow: "hidden",
                    paddingRight: "8px",
                  }),
                }}
                theme={customTheme}
                options={userData}
                placeholder="User"
                className="w-full"
                menuPlacement="auto"
                maxMenuHeight={150}
                onChange={(selectedOption) => {
                  methods.setValue("userId", selectedOption?.value || "", {
                    shouldValidate: true,
                  });
                }}
                value={
                  // Fix for user selection visibility
                  userData.find(
                    (option) => option.value === methods.watch("userId")
                  ) || null
                }
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1 text-gray-900 dark:text-white">
                Select Type
              </label>
              <Select
                styles={{
                  ...customSelectStyles,
                  singleValue: (base) => ({
                    ...base,
                    color: isDarkMode ? "#ffffff" : "#000000",
                    fontSize: "0.875rem",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                    // overflow: "hidden",
                    paddingRight: "8px",
                  }),
                }}
                theme={customTheme}
                options={categoryOptions}
                placeholder="Type"
                className="w-full"
                menuPlacement="auto"
                maxMenuHeight={150}
                onChange={(opt) =>
                  methods.setValue("typeId", opt?.value || "", {
                    shouldValidate: true,
                  })
                }
                value={
                  categoryOptions.find(
                    (opt) => opt.value === methods.watch("typeId")
                  ) || null
                }
              />
            </div>

            {/* <div>
              <label className="block text-xs font-medium mb-1 text-gray-900 dark:text-white">
                Select Status
              </label>
              <Select
                styles={customSelectStyles}
                theme={customTheme}
                options={statusOptions}
                placeholder="Select Status"
                className="w-full rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                onChange={(selectedOption) => {
                  methods.setValue("status", selectedOption?.value || "", {
                    shouldValidate: true,
                  });
                }}
                value={
                  statusOptions.find(
                    (option) => option.value === methods.watch("status")
                  ) || null
                }
              />
            </div> */}
          </div>
          <div className="">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select Status
            </label>
            <Select
              styles={{
                ...customSelectStyles,
                singleValue: (base) => ({
                  ...base,
                  color: isDarkMode ? "#ffffff" : "#000000",
                  fontSize: "0.875rem",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  // overflow: "hidden",
                  paddingRight: "8px",
                }),
              }}
              theme={customTheme}
              options={statusOptions}
              placeholder="Select Status"
              className="w-full rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(selectedOption) => {
                methods.setValue("status", selectedOption?.value || "", {
                  shouldValidate: true,
                });
              }}
              value={
                statusOptions.find(
                  (option) => option.value === methods.watch("status")
                ) || null
              }
            />
            {methods.formState.errors.status && (
              <span className="text-red-500 text-sm mt-1">
                {methods.formState.errors.status.message}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                <FontAwesomeIcon icon={faRotateLeft} className="mr-1" />
                Reset
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700 dark:text-white"
              >
                Clear All
              </button>
            </div>
            <Button 
             disabled={loading || !hasActiveFilters} 
            className={`${loading || !hasActiveFilters? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
            }`}>{loading ? "Loading..." : buttonName}</Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default Filter;
