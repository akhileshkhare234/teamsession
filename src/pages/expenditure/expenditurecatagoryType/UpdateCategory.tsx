import Input from "components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import { showToast } from "components/Toaster";
import httpClient from "services/network/httpClient";
import Button from "components/button/Button";

const schema = yup.object().shape({
  name: yup.string().required("Enter valid category name"),
});

interface UpdateGettingData {
  id: string;
  name: string;
}
interface Update {
  onClose: () => void;
  getData: () => void;
  updateData: UpdateGettingData;
}

const UpdateCategory = ({ getData, onClose, updateData }: Update) => {
    console.log("UpdateCategory component rendered with updateData:", updateData);
  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: updateData.name,
    },
  });

  const submit = (data: any) => {
    console.log(data);
    httpClient
      .put(`/reimbursements/types/${updateData.id}`, data)
      .then((responce: any) => {
        console.log(responce);
        console.log("this is Add Employees  responce");
        if (responce.success === true) {
          showToast("Category  updated successfully", "success");
          getData();
        } else {
          showToast(responce.error.message, "error");
        }
      })
      .catch((error) => {
        console.log(error);
        showToast(error.response.message, "error");
      })
      .finally(() => {
        onClose();
      });
  };
  return (
    <div className="flex flex-col  w-full p-1 sm:overflow-hidden overflow-y-auto">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(submit)}
          className="flex flex-col gap-2 w-full p-4"
        >
          <Input
            name={"name"}
            label="Category Name"
            placeholder="Enter Category Name"
            className="col-span-1 w-80  bg-white text-black  dark:bg-[#374151] dark:text-white"
            required={true}
            onlyLetters
            aria-invalid={methods.formState.errors.name ? "true" : "false"}
            aria-errormessage="name-error"
          ></Input>
          <Button className="w-28 ">Submit</Button>
        </form>
      </FormProvider>
    </div>
  );
};
export default UpdateCategory;
