import Button from "components/button/Button";
import Input from "components/Input";
import { showToast } from "components/Toaster";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import httpClient from "services/network/httpClient";

interface AddConfigProps {
  dataValue?: any;
  onSuccess?: () => void;
}

const AddConfig = ({dataValue, onSuccess}:AddConfigProps) => {
  const methods = useForm({
    defaultValues: {
      ...dataValue,
    }
  });


  const onSubmit = (data: any) => {
    console.log(data);
    httpClient
      .put("/advance-config/app-config", data)
      .then((response:any) => {
        console.log("Config added successfully:", response);
        if (!response || !response.value) {
          console.error("No data found in response");
          showToast("Fields cannot be empty", "error");
          return;
        }

        showToast("Config Updated successfully", "success");
        if (onSuccess) {
          onSuccess();
        }

        // Handle success, e.g., show a success message or update the UI
      })
      .catch((error) => {
        console.error("Error adding config:", error);
        // Handle error, e.g., show an error message
      });
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          name="minAmount"
          label="Minimum Amount"
          type="number"
          placeholder="Enter minimum amount"
           rules={{
    required: "Minimum amount field is required",
    min: { value: 1, message: "Minimum amount must be at least 1" },
    max: { value: 10000, message: "Minimum amount cannot exceed 10000" },
  }}
        />
        <Input
          name="maxAmount"
          label="Maximum Amount"
          type="number"
          placeholder="Enter maximum amount"
           rules={{
    required: "Maximun amount field is required",
    min: { value: 1, message: "Maximun amount must be at least 1" },
    max: { value: 10000, message: "Maximum amount cannot exceed 10000" },
  }}
        />
        <Input
          name="maxDescriptionLength"
          label=" Description Length"
          type="number"
          placeholder="Enter maximum description length"
           rules={{
    required: "Maximum description length is required",
    min: { value: 1, message: "Maximum description length must be at least 1" },
    max: { value: 10000, message: "maximum description length cannot exceed 255" },
  }}
        />
        <div className="flex justify-end mt-4">
           <Button>Update Config</Button>
        </div>
      </form>
     </FormProvider>
  );
};

export default AddConfig;
