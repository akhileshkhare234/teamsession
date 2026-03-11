import { yupResolver } from "@hookform/resolvers/yup";
import Select from "react-select";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import httpClient from "services/network/httpClient";
import Input from "components/Input";
import PillButton from "components/button/Pills";
import { showToast } from "components/Toaster";
import {
  getCustomSelectStyles,
  getCustomTheme,
  useDarkMode,
} from "utils/selectStyles";
// import CustomeSelect from "../../components/select/CustomeSelect";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export interface UserProps {
  id: string;
  username: string;
  email: string;
  city: string;
  mobile: string;
  state: string;
  postalCode: string;
  gender: string;
  address: string;
  employeeCode: string;
  designation: string;
  status: string;
  reportingTo: string;
  countryCode: string;
}

interface UserTypes {
  value: number;
  label: string;
}

interface UpdateProps {
  upDatedData: UserProps;
  onClose: () => void;
  getData: () => void;
  emailData: any[];
}

const validationSchema = yup.object().shape({
  firstName: yup.string().required("Employee name is required ") ,
  email: yup.string()
    .required("Email is required (e.g., example@domain.com)")
    .email("Please enter valid email address")
    // .matches(
    //   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      .matches(
      /^[^\s@]+@[^\s@]+\.(com|in|org|net|edu|gov|info|co|ai)$/i,
      "Enter email with valid domain"
    ),
  city: yup.string().required("City is required") ,
  countryCode: yup.string().required("Country code is required"),
  mobile: yup.string().required("Mobile number is required")
   .test("is-ten-digits", "Mobile number must be exactly 10 digits", (value) => {
    if (!value) return false;
    const digits = value.replace(/\D/g, ""); // "+91 9876543210" → "919876543210"
     // If starts with country code "91", drop it
    const cleaned = digits.startsWith("91") ? digits.slice(2) : digits;
    return cleaned.length === 10;
  }),
  state: yup.string().required("State is required ") ,
  postalCode: yup.string()
    .matches(/^[0-9]{6}$/, "Postal code must be exactly 6 digits")
    .length(6, "Postal code must be exactly 6 digits").required("enter valid postal code "),
  gender: yup.string().required("Select Gender "),
  address: yup.string().required("Address is required"),
  employeeCode: yup.string(),
  designation: yup.string().required("Designation is required"),
  reportingToId: yup.number(),
  status: yup.string().required("Select employee status "),
});

// Helper function to get the country code for PhoneInput
const getCountryCode = (dialCode: string = "") => {
  // Remove + if present
  const code = dialCode.replace("+", "");
  
  // Map common dial codes to ISO country codes
  const codeMap: {[key: string]: string} = {
    "1": "us",    // United States/Canada
    "44": "gb",   // United Kingdom
    "91": "in",   // India
    "61": "au",   // Australia
    "852": "hk",  // Hong Kong
    "36": "hu",   // Hungary
    "354": "is",  // Iceland
    "971": "ae",  // UAE
    "966": "sa",  // Saudi Arabia
    "65": "sg",   // Singapore
    "81": "jp",   // Japan
    "82": "kr",   // South Korea
    "86": "cn",   // China
    "49": "de",   // Germany
    "33": "fr",   // France
    "39": "it",   // Italy
    "7": "ru",    // Russia
    "34": "es",   // Spain
    "977": "np",  // Nepal
    "94": "lk",   // Sri Lanka
    "880": "bd",  // Bangladesh
    "92": "pk",   // Pakistan
    "95": "mm",   // Myanmar
  };
  
  return codeMap[code] || "in"; // Default to India if not found
};

const UpdateEmployee = ({
  upDatedData,
  onClose,
  getData,
  emailData,
}: UpdateProps) => {
  console.log("UpdateEmployee rendering with data:", upDatedData);
  console.log("Mobile from upDatedData:", upDatedData.mobile);
  console.log("Country code:", upDatedData.countryCode);
  console.log("Mobile number (extracted):", upDatedData.mobile);
  
  // Initialize mobile state with the pre-extracted mobile number from EmployeesList
  const [mobile, setMobile] = React.useState(upDatedData.mobile || "");

  // Country codes now handled in the EmployeesList component

  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      ...upDatedData,
      gender: upDatedData.gender || "",
      countryCode: upDatedData.countryCode || "+91", // Use pre-extracted country code
      mobile: upDatedData.mobile || "" // Use pre-extracted mobile number
    },
  });

  // No need for the complex useEffect anymore since we're getting pre-extracted values

  const isDarkMode = useDarkMode();
  const customSelectStyles = getCustomSelectStyles(isDarkMode);
  const customTheme = getCustomTheme(isDarkMode);


 
  const [phoneError, setPhoneError] = React.useState("");
  console.log("Mobile number:", mobile);

  const submit = (data: any) => {
    // Validate phone number
    if (!mobile || mobile.replace(/\D/g, "").length < 6) {
      setPhoneError("Mobile number must be at least 6 digits");
      return;
    }
    setPhoneError("");
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      showToast("Please enter a complete email address (e.g., name@domain.com)", "error");
      return;
    }
    
    // Make sure the domain has at least a . and something after it
    const parts = data.email.split('@');
    if (parts.length !== 2 || !parts[1].includes('.') || parts[1].split('.')[1].length < 2) {
      showToast("Email domain is incomplete. Please include full domain with extension (e.g., .com, .org)", "error");
      return;
    }
    
    // Get country code from form
    const countryCode = methods.getValues("countryCode");
    console.log("Country code for submission:", countryCode);
    console.log("Mobile for submission:", mobile);
    
    // Format the final mobile number by combining country code and mobile number
    // Make sure there's no + prefix in the mobile part to avoid double +
    const formattedMobile = `${countryCode}${mobile.replace(/^\+/, '')}`;
    console.log("Formatted mobile for submission:", formattedMobile);
    
    const payload = {
      ...data,
      mobile: mobile.includes("+") ? mobile : `+${mobile}`,
    };
    console.log("Payload for submission:", payload);
    delete payload.countryCode;
    httpClient
      .put(`employees/update`, payload)
      .then((responce: any) => {
        console.log("Update Employee responce");
        if (responce.success === true) {
          showToast("Employee Details have been updated successfully", "success");
        } else {
          showToast(`${responce.error.message}`, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        showToast("something went wrong", "error");
      })
      .finally(() => {
        onClose();
        getData();
      });
  };

  const userStatus = [
    {
      value: "ACTIVE",
      label: "ACTIVE",
    },
    {
      value: "INACTIVE",
      label: "INACTIVE",
    },
  ];
  const data1: UserTypes[] = emailData;
  console.log(data1);
  const genderData = [
    {
      value: "Male",
      label: "MALE",
    },
    {
      value: "Female",
      label: "FEMALE",
    },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submit)}>
        <div className="grid grid-cols-4 gap-4 p-2 w-full">
          <div>
           
            <Input
              name={"firstName"}
              label={"Employee Name"} 
              required
              onlyLetters
              placeholder="Enter Employee Name"
            />
          </div>
          <div>
            <Input
              type="email"
              name={"email"}
              label={"Email"} 
              required
              placeholder="Enter Employee Email"
              className="bg-gray-200 text-gray-600 cursor-not-allowed border border-gray-300"
              readOnly
            />
            {/* {methods.formState.errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {methods.formState.errors.email?.message?.toString()}
              </p>
            )} */}
            {/* {methods.formState.errors.email ? (
              <p className="text-red-500 text-xs mt-1">
                Format: name@domain.com
              </p>
            ) :  <p className="text-gray-500 text-xs mt-1">
                Format: name@domain.com
              </p>} */}
          </div>
          <div>
           <label className="text-sm font-medium text-gray-900 dark:text-white mt-1">
          Mobile Number <span className="text-red-500">*</span></label>
            <PhoneInput
              country={getCountryCode(upDatedData.countryCode)}
              value={mobile}
              onChange={(value: string, country: any) => {
                console.log("Phone input value changed to:", value);
                console.log("Country data:", country);
                // Store just the number part in mobile state
                setMobile(value);
                   // Send full value to RHF — DO NOT strip digits
              methods.setValue("mobile", value, { shouldValidate: true });
            // Save country code correctly
             methods.setValue("countryCode", `+${country.dialCode}`);
              }}
              //In dark mode input field color
              inputClass="!w-full !bg-white  !text-[#374151]  !border-none  dark:!bg-gray-800  dark:!text-white [&>input]:!text-[#374151]
  dark:[&>input]:!text-white"
              buttonClass="!bg-white dark:!bg-gray-700"
             dropdownClass="
  !bg-white !text-[#374151] 
  dark:!bg-gray-800 dark:!text-white

  [&>.country:hover]:!bg-gray-100 
  [&>.country:hover]:!text-black
  dark:[&>.country:hover]:!bg-gray-700 
  dark:[&>.country:hover]:!text-white

  [&>.country.highlight]:!bg-gray-200 
  [&>.country.highlight]:!text-black
  dark:[&>.country.highlight]:!bg-gray-700 
  dark:[&>.country.highlight]:!text-white"//text color when cursor over the dropdown
              inputProps={{
                name: "mobile",
                required: true,
                autoFocus: false,
              }}
               searchClass="!text-black dark:!text-black !bg-white dark:!bg-gray-700" //seach field text color
              enableSearch
              countryCodeEditable={false}

              containerStyle={{
             width: "100%",
             borderRadius: "0.5rem",
             border: "1px solid #d1d5db",   // <- light mode border visible
}}
            />
             {methods.formState.errors.mobile && (
            <span className="text-red-500 text-xs mt-1">
           {methods.formState.errors.mobile.message as string}
          </span>
         )}
            {phoneError && (
              <span className="text-red-500 text-xs mt-1">{phoneError}</span>
            )}
          </div>
          <div>
            <Input
              name={"designation"}
              label={"Designation"}
              required
              onlyLetters
              placeholder="Enter Designation "
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Gender
              <span className="text-red-500"> *</span>
            </label>
            <Select
              {...methods.register("gender")}
              styles={customSelectStyles}
              options={genderData}
              placeholder="Select Gender"
              className="w-full  rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(selectedOption) =>
                selectedOption &&
                methods.setValue("gender", selectedOption.value)
              }
              defaultValue={
                genderData && genderData.find((option) => option.value === upDatedData.gender)
                  ? genderData.find((option) => option.value === upDatedData.gender)
                  : null
                }
            ></Select>
            {methods.formState.errors.gender && (
              <p className="text-red-400">
                {methods.formState.errors.gender.message}
              </p>
            )}
          </div>
          <Input
            name={"city"}
            label={"City "} 
            required
            onlyLetters
            placeholder="Enter Employee City"
            // className="col-span-1"
          ></Input>
          <Input
            name={"state"}
            label={"State "}
            required
            onlyLetters
            placeholder="Enter Employee State"
            // className="col-span-1"
          ></Input>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              {" "}
              Select Reporter 
            </label>
            <Select
              styles={customSelectStyles}
              theme={customTheme}
              {...methods.register("reportingToId")}
              options={data1}
              placeholder="Select Employee"
              className="w-full rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(selectedOption) => {
                selectedOption &&
                  methods.setValue("reportingToId", selectedOption.value);
              }}
              defaultValue={
                data1 &&
                data1.find((option) =>
                  option.label === upDatedData.reportingTo
                    ? upDatedData.reportingTo
                    : ""
                )
              }
            />
            {methods.formState.errors.reportingToId && (
              <span className="text-red-500 text-sm mt-1">
                {methods.formState.errors.reportingToId.message}
              </span>
            )}
          </div>
          <div>
            <label id="status" className="dark:text-white">
              User Status <span className="text-red-500">*</span>
            </label>
            <Select
              styles={customSelectStyles}
              theme={customTheme}
              {...methods.register("status")}
              options={userStatus}
              placeholder={"Select User Status"}
              className="w-full rounded-md border mt-2 border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
              onChange={(selectedOption) => {
                selectedOption &&
                  methods.setValue("status", selectedOption.value);
              }}
              defaultValue={
                userStatus &&
                userStatus.find((option) =>
                  option.label === upDatedData.status ? upDatedData.status : ""
                )
              }
            ></Select>
            {methods.formState.errors.status && (
              <span className="text-red-500 text-sm mt-1">
                {methods.formState.errors.status.message}
              </span>
            )}
          </div>
          <Input
            name={"address"}
            label={"Address"}
            required
            placeholder="Enter Employee address"
            // className="col-span-1"
          ></Input>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Postal Code <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Postal Code"
              type="text"
              maxLength={6}
              {...methods.register("postalCode")}
              onInput={(e) => {
                const input = e.target as HTMLInputElement;
                input.value = input.value.replace(/\D/g, '').slice(0, 6);
                methods.setValue("postalCode", input.value);
              }}
            />
            {methods.formState.errors.postalCode && (
              <p className="text-red-500 text-xs mt-1">
                {methods.formState.errors.postalCode.message?.toString()}
              </p>
            )}
          </div>
        </div>

        <div className="flex ml-20 p-3 items-center justify-end gap-6 ">
          <PillButton type="submit" variant="secondary">
            {" "}
            Submit{" "}
          </PillButton>
          <PillButton type="reset" onClick={onClose} variant="primary">
            Cancel
          </PillButton>
        </div>
      </form>
    </FormProvider>
  );
};
export default UpdateEmployee;
