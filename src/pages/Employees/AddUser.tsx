/* eslint-disable no-template-curly-in-string */
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import httpClient from "services/network/httpClient";
import Input from "components/Input";
import PillButton from "components/button/Pills";
import { showToast } from "components/Toaster";
import { setLocale } from "yup";
// import {
//   getCustomSelectStyles,
//   getCustomTheme,
//   useDarkMode,
// } from "utils/selectStyles";
import CustomeSelect from "../../components/select/CustomeSelect";
import { useDarkMode } from "utils/selectStyles";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";


setLocale({
  mixed: {
    required: "Enter valid ${path} ",
    notType: "${path} must be a valid ${type}",
  },
  string: {
    email: "${path} must be a valid email",
    min: "${path} must be at least ${min} characters",
    max: "${path} must be at most ${max} characters",
    matches: "${path} format is invalid",
  },
  number: {
    min: "${path} must be at least ${min}",
    max: "${path} must be at most ${max}",
  },
});

const schema = yup.object().shape({
  username: yup.string().trim().required("Enter Valid Employee name"),
  email: yup.string()
    .trim()
    .required("Enter valid Email (e.g., example@domain.com)")
    .email("Enter valid email address")
    // .matches(
    //   /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      // "Email format is invalid. Please include domain (e.g., example@domain.com)"
       .matches(
      /^[^\s@]+@[^\s@]+\.(com|in|org|net|edu|gov|info|co|ai)$/i,
      "Enter email with valid domain"
    ),
  city: yup.string().required().trim(),
  countryCode: yup.string().required(),
  // mobile: yup
  //   .number()
  //   .typeError("Mobile number must be a number")
  //   .min(100000, "Mobile number must be at least 6 digits")                      //phone number returns string not a number
  //   .max(999999999999999, "Mobile number must be at most 15 digits")
  //   .required(),

  mobile: yup.string().required("Mobile number is required")
 .test("is-ten-digits", "Mobile number must be exactly 10 digits", (value) => {
    if (!value) return false;
    const digits = value.replace(/\D/g, ""); // "+91 9876543210" → "919876543210"
     // If starts with country code "91", drop it
    const cleaned = digits.startsWith("91") ? digits.slice(2) : digits;
    return cleaned.length === 10;
  }),

  state: yup.string().trim().required(),
  postalCode: yup.string()
    .required("Postal code is required")
    .matches(/^[0-9]{6}$/, "Postal code must be exactly 6 digits")
    .length(6, "Postal code must be exactly 6 digits"),
  gender: yup.string().trim().required("Select valid gender"),
  address: yup.string().trim().required(),
  employeeCode: yup.string().trim(),
  designation: yup.string().trim().required() ,
  reportingToId: yup.number(),
});
interface AddProps {
  onClose: () => void;
  getData: () => void;
  emailData: any[];
}

const AddUser = ({ onClose, getData, emailData }: AddProps) => {
  const isDarkMode = useDarkMode();

  // const customSelectStyles = getCustomSelectStyles(isDarkMode);
  // const customTheme = getCustomTheme(isDarkMode);

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      countryCode: "+91",
      // reportingToId: 0,
      // username:"",
      // email:"",
      // city:"",
      // mobile: 123-456-7890 ,
      // state:"",
      // postalCode:"",
      // gender:"",
      // address:"",
      // employeeCode:"",
      // designation:"",




    },
    mode: "all",//phone validation
  });
  const [mobile, setMobile] = React.useState("");
 // const [phoneError, setPhoneError] = React.useState("");

  const submit = (data: any) => {
    // Validate phone number
    // if (!mobile || mobile.replace(/\D/g, "").length < 10) {
    //   setPhoneError("Mobile number must be at least 6 digits");   //yup validation will handel it
    //   return;
    // }
    // setPhoneError("");
    
    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(data.email)) {
      showToast("Please enter a valid email address with format name@domain.com", "error");
      return;
    }
    
    // Additional check for common email domains to provide helpful errors
    if (!data.email.includes(".")) {
      showToast("Email domain is incomplete. Please include domain extension (e.g., .com, .org)", "error");
      return;
    }
    
    let formattedMobile = mobile;
    if (!formattedMobile.startsWith("+")) {
      formattedMobile = `+${mobile}`;
    }
    const payload = {
      ...data,
      mobile: formattedMobile,
    };
    delete payload.countryCode;

    httpClient
      .post("employees/create", payload)
      .then((responce: any) => {
        console.log(responce);
        console.log("this is Add Employees  responce");
        if (responce.success === true) {
          showToast("Employee account is created  successfully", "success");
        } else {
          // showToast(`${responce.error.message}`, "error");
          responce.error.message
            ? showToast(`${responce.error.message}`, "error")
            : showToast(`Please Check Your Inputs`, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        showToast("Something went wrong", "error");
      })
      .finally(() => {
        onClose();

        getData();
      });
  };

  const data1 = emailData;
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

  // const countryCodes = [
  //   { label: "+1 (US)", value: "+1" },
  //   { label: "+44 (UK)", value: "+44" },
  //   { label: "+91 (India)", value: "+91" },
  //   { label: "+61 (Australia)", value: "+61" },
  //   // add more as needed
  // ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submit)}>
        <div className="space-y-4 w-full md:grid lg:grid-cols-4 md:grid-cols-2 gap-4">
          <div className="mt-4 dark:text-white dark:bg-gray-800">
            <Input
              name={"username"}
              label={"Employee Name "}                          //UI
              placeholder="Enter Employee Name"
              required
              onlyLetters
            />
          </div>
          <div className="mb-3">
            <Input
              type="email"
              name={"email"}
              label={"Email  "}
              placeholder="Enter Employee Email"
              required
            />
           
          </div>

           <div className="mb-3 col-span-1">
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white mt-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <div className="relative rounded-lg border border-gray-300">
              <PhoneInput                                                     
                country={"in"}
                value={mobile}
                name={"mobile"}
                required
                // onChange={(value: string) => setMobile(value)}
                onChange={(value: string) => {
               setMobile(value);
               methods.setValue("mobile", value, { shouldValidate: true });
}}
//phone input field background and dropdown background color
              inputClass="!w-full !bg-white !text-[#374151] dark:!bg-gray-800 dark:!text-white !border-none"
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
                inputStyle={{
                  width: "100%",
                  height: "38px",
                  borderRadius: "0.5rem",
                  border: "none",
                  fontSize: "14px",
                
                }}
                buttonStyle={{
                  border: "none",
                  background: "none",
                  borderRadius: "0.5rem 0 0 0.5rem",
                }}
                containerStyle={{
                  margin: "0",
                }}
              />
            </div>
            {methods.formState.errors.mobile && (
              <span className="text-red-500 text-xs mt-1">{methods.formState.errors.mobile.message}</span>
            )}
          </div>

         

          <Input
            name={"designation"}
            label={"Designation  "}
            placeholder="Enter Designation"
            required
            onlyLetters
          />

          <div className="mb-4">
            <label
              htmlFor="gender"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Select Gender
              <span className="text-red-500"> *</span>
            </label>
            <CustomeSelect
              name="gender"
              options={genderData}
              placeholder="Select Gender"
      
              value={genderData.find((option:any) => option.value === methods.getValues("gender"))}
              onChange={(selectedOption: { value: string; label: string } | null) =>
                selectedOption && methods.setValue("gender", selectedOption.value,{ shouldValidate: true })
              }
              theme={isDarkMode ? "dark" : "light"}
              error={methods.formState.errors.gender?.message}
            />
            
          </div>
          <Input
            name={"city"}
            label={"City "}
            placeholder="Enter Employee City"
            required
            onlyLetters
          />
          <Input
            name={"state"}
            label={"State  "}
            placeholder="Enter Employee State"
            required
            onlyLetters
          />
          <div className="">
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Select Reporting To
            </label>
            <CustomeSelect
              name="reportingToId"
              options={data1}
              placeholder="Select Employee"
              value={data1.find((option:any) => option.value === methods.getValues("reportingToId"))}
              onChange={(selectedOption:any) => {
                selectedOption && methods.setValue("reportingToId", selectedOption.value);
              }}
              theme={isDarkMode ? "dark" : "light"}
              error={methods.formState.errors.reportingToId?.message}
              
            />
          </div>
          <Input
            name={"address"}
            label={"Address  "}
            placeholder="Enter Employee address"
            required
          />
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
              Postal code <span className="text-red-500">*</span>
            </label>
            <input
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter Postal Code"
              type="text"
              required
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

export default AddUser;
