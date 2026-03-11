import DataTable from "components/DataTable";
import Loader from "components/Loader";
import GenericModal from "components/Modal";
// import { showToast } from "components/Toaster";
import Modal from "components/Modal";
import React, { useState, useEffect } from "react";
import httpClient from "services/network/httpClient";
import AddUser from "./AddUser";
// import EmployeeDetailModal from "./EmployeeDetailModal";
import UpdateEmployee from "./UpdateEmployee";
import { Link } from "react-router-dom";
import EmployeeDetail from "./EmployeeDetail";
import { sortByKey } from "utility/sorting";

type productItem = {
  firstName: string;
  email: string;
  mobile: number;
  designation: string;
  state: string;
  reportingTo: string;
};

const EmployeesList = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState<any>();
  const [vieData, setVieData] = useState<any>();
  const [isView, setIsView] = useState(false);
  const [emaiData, setEmailData] = useState<any[]>([]);
  const [currentEmployeeIndex, setCurrentEmployeeIndex] = useState(0);

  const getData = () => {
    setLoading(true);
    httpClient
      .get("employees/all?page=1&size=2000")
      .then((res: any) => {
        const sort = sortByKey(res.value.contents, "firstName");
        console.log("Employee response", res.value.contents);
        console.log("Employee response", sort);
        setData(res.value.contents);
        const emailOptions = res.value.contents.map((email: any) => ({
          value: email.id,
          label: email.firstName,
        }));
        setEmailData(emailOptions);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  // Define country codes at component level for reuse
  const countryCodes = [
    "+1", "+44", "+91", "+61", "+852", "+36", "+354", "+971", "+966", "+65",
    "+81", "+82", "+86", "+49", "+33", "+39", "+7", "+34", "+977", "+94",
    "+880", "+92", "+95"
  ];

  const handleEdit = (row: any) => {
    // Create a copy of the row data to modify
    const updatedRow = { ...row };
    
    // Extract country code and mobile number
    const rawMobile = updatedRow.mobile || "";
    console.log("Raw mobile in handleEdit:", rawMobile);
    
    // Make sure mobile has a + prefix for consistent processing
    const formattedMobile = rawMobile.startsWith('+') ? rawMobile : `+${rawMobile}`;
    
    // Sort country codes by length (longest first) for proper matching
    const sortedCodes = [...countryCodes].sort((a, b) => b.length - a.length);
    
    // Find matching country code
    const matchedCode = sortedCodes.find(code => 
      formattedMobile.startsWith(code)
    ) || "+91";
    console.log("Matched country code:", matchedCode);
    
    // Extract the mobile number without country code
    const mobileNumber = formattedMobile.replace(matchedCode, "");
    console.log("Extracted mobile number:", mobileNumber);
    
    // Add these to the updated row data
    updatedRow.countryCode = matchedCode;
    updatedRow.mobileNumber = mobileNumber;
    
    // Set the edit data and open the modal
    setIsEdit(true);
    setEditData(updatedRow);
  };

  const handleView = (row: any) => {
    const index = data.findIndex((item: any) => item.id === row.id);
    setCurrentEmployeeIndex(index);
    setIsView(true);
    setVieData(row);
    <Link to={`details`}></Link>;
  };

  // const handleDelete = (row: any) => {
  //   httpClient
  //     .delete(`employees/${row.id}`)
  //     .then((response: any) => {
  //       if (response.success) {
  //         showToast("Employee deleted successfully", "success");
  //         getData();
  //       } else {
  //         showToast(response.error.message, "error");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       showToast("Failed to delete employee", "error");
  //     });
  // };

  const handleEmployeeNavigation = (newIndex: number) => {
    setCurrentEmployeeIndex(newIndex);
    setVieData(data[newIndex]);
  };

  const tableData: { header: string; accessor: keyof productItem }[] = [
    { accessor: "firstName", header: "Employee Name" },
    { accessor: "email", header: "Email" },
    { accessor: "mobile", header: "Contact Number" },
    { accessor: "designation", header: "Designation" },
    { accessor: "state", header: "State" },
    { accessor: "reportingTo", header: "Reporting To" },
  ];

  const handleAdd = () => {
    setIsAdding(true);
  };


  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        {!isView ? (
          loading ? (
            <Loader />
          ) : (
            <DataTable
              columns={tableData}
              data={data}
              isSearch={true}
              isAdding={true}
              isExport={true}
              actions={["edit", "view", "delete"]}
              onEdit={handleEdit}
              onView={handleView}
              onRowClick={handleView}
              onAddBtnClick={handleAdd}
              theadHeight="h-[calc(100vh-205px)]"
              itemsPerPages={10}
            />
          )
        ) : (
          <EmployeeDetail
            data={vieData}
            allEmployees={data}
            currentIndex={currentEmployeeIndex}
            onNavigate={handleEmployeeNavigation}
            onBack={() => setIsView(false)}
          />
        )}
      </div>
      {isAdding && (
        <Modal
          isOpen={isAdding}
          onClose={() => {
            setIsAdding(false);
            setLoading(false);
          }}
          customWidth="max-w-[90%]"
          header="Add Employee"
        >
          <AddUser
            onClose={() => setIsAdding(false)}
            getData={getData}
            emailData={emaiData}
          />
        </Modal>
      )}
      {isEdit && (
        <GenericModal
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}
          header="Edit Employee"
          customWidth="md:max-w-[90%]"
        >
          <UpdateEmployee
            upDatedData={editData}
            emailData={emaiData}
            getData={getData}
            onClose={() => setIsEdit(false)}
          />
        </GenericModal>
      )}
    </div>
  );
};

export default EmployeesList;
