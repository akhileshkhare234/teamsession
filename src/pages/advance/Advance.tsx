import DataTable from "components/DataTable";
import Loader from "components/Loader";
import Modal from "components/Modal";
import React, { useEffect, useState } from "react";
import httpClient from "services/network/httpClient";
import AddAdvance from "./AddAdvance";
import AdvanceHistory from "./AdvanceHistory";
import SettledAmount from "./SettledAmount";
import { sortByKey } from "utility/sorting";

type AdvanceItem = {
  userId: number;
  userName: string;
  advanceGiven: number;
  totalApplied: number;
  totalApproved: number;
  settlementDone: number;
  amountPayableToUser: number;
  totalAmountGiven: number;
};

const AdvancesPayments = () => {
  const [data, setData] = useState<AdvanceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  // const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<AdvanceItem | null>(null);
  const [isView, setIsView] = useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isAddPayment, setIsAddPayment] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<AdvanceItem | null>(null);
  const [configDetails, setConfigDetails] = useState<any>(null);

  const getData = () => {
    setLoading(true);
    httpClient
      .get("advances/all")
      .then((res: any) => {
        console.log("Advance data", res);
        sortByKey(res.value, "userName");
        setData(res.value || []);
      })
      .catch((err) => {
        console.error("Failed to fetch advances", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getConfigDetails = () => {
    httpClient
      .get("/advance-config/app-config")
      .then((response: any) => {
        console.log("Advance Payment Config Data:", response);
        if (!response || !response.value) {
          console.error("No data found in response");
          return;
        }
        setConfigDetails(response.value);
        // Handle the response data as needed
      })
      .catch((error) => {
        console.error("Error fetching advance payment config:", error);
      });
    }

  useEffect(() => {
    getData();
    getConfigDetails();
  }, [refresh]);

  const tableData: { header: string; accessor: keyof AdvanceItem }[] = [
    { header: "Employee Name", accessor: "userName" },
    { header: "Advance Given", accessor: "advanceGiven" },
    { header: "Total Applied", accessor: "totalApplied" },
    { header: "Total Approved", accessor: "totalApproved" },
    { header: "Settlement Done ", accessor: "settlementDone" },
    { header: "totalAmount Given", accessor: "totalAmountGiven" },
    { header: "Amount Payable To User", accessor: "amountPayableToUser" },
  ];

  // Custom row renderer for adding action button column
  const customRowRenderer = (row: AdvanceItem) => (
    <tr className="hover:bg-gray-200 dark:hover:bg-[#444444]">
      {tableData.map((col, colIndex) => (
        <td
          key={colIndex}
          className="p-5 text-sm font-normal text-gray-900 cursor-pointer dark:text-white"
          onClick={() => handleView(row)}
        >
          {col.accessor === "amountPayableToUser" && row[col.accessor] > 0
            ? `₹${row[col.accessor].toLocaleString()}`
            : row[col.accessor]}
        </td>
      ))}
      <td className="p-5 dark:text-white">
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click event
            handleAddPayment(row);
          }}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Settle Payment
        </button>
      </td>
    </tr>
  );
  const onSuccess = () => {
    setRefresh((prev) => !prev);
  };

  const handleView = (row: any) => {
    console.log("View row data", row);
    setIsView(true);
    setEditData(row);
  };

  const handleAddPayment = (row: AdvanceItem) => {
    setSelectedUser(row);
    setIsAddPayment(true);
  };

  const handleAdd = () => {
    setIsAdding(true);
  };
  // const handlPaymentSybmit = (data: any) => {
  //   console.log("Payment data submitted", data);
  //   httpClient
  //     .post("advances/add-payment", data)
  //     .then((response) => {
  //       if (response.success) {
  //         setIsAddPayment(false);
  //         setRefresh((prev) => !prev);
  //       } else {
  //         console.error("Failed to add payment", response.error);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error adding payment", error);
  //     });
  // };
  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <Loader />
        ) : (
          <DataTable
            columns={tableData}
            data={data}
            isSearch={true}
            isExport={true}
            theadHeight="h-[calc(100vh-205px)]"
            itemsPerPages={10}
            actions={["view"]}
            onView={handleView}
            onRowClick={handleView}
            onAddBtnClick={handleAdd}
            isAdding={true}
            customRowRenderer={customRowRenderer}
            customHeaderRenderer={(columns) => (
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className="p-5 text-left text-sm font-medium text-gray-800 capitalize cursor-pointer dark:text-white"
                  >
                    {col.header}
                  </th>
                ))}
                <th className="p-5 text-left text-sm font-medium text-gray-800 capitalize dark:text-white">
                  Actions
                </th>
              </tr>
            )}
          />
        )}
      </div>

      {/* Existing modals */}
      {isAdding && (
        <Modal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          header="Add Advance"
          size="md"
        >
          <AddAdvance
            onClose={() => setIsAdding(false)}
            onSuccess={() => setRefresh((pre: any) => !pre)}
            updateData={null}
            minAmount={configDetails?.minAmount ?? 0}
            maxAmount={configDetails?.maxAmount ?? 1000000}
            maxDescriptionLength={configDetails?.maxDescriptionLength ?? 300}
          />
        </Modal>
      )}

      {isView && (
        <Modal
          isOpen={isView}
          onClose={() => setIsView(false)}
          header="Advance History"
          size="xl"
        >
          <AdvanceHistory
            onClose={() => setIsView(false)}
            onSuccess={() => setRefresh((pre: any) => !pre)}
            id={editData && (editData as any)?.userId}
            minAmount={configDetails?.minAmount ?? 0}
            maxAmount={configDetails?.maxAmount ?? 1000000}
            maxDescriptionLength={configDetails?.maxDescriptionLength ?? 300}
          />
        </Modal>
      )}

      {/* Add new payment modal */}
      {isAddPayment && selectedUser && (
        <Modal
          isOpen={isAddPayment}
          onClose={() => setIsAddPayment(false)}
          header={`Settle Amount for ${selectedUser.userName}`}
          size="md"
        >
          <SettledAmount
            selectedUser={selectedUser}
            onClose={() => setIsAddPayment(false)}
            onSuccess={onSuccess}
          ></SettledAmount>
          {/* <div className="p-4">
            <form onSubmit={handlPaymentSybmit} className="space-y-4">
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
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    User
                  </p>
                  <p className="text-lg font-semibold">
                    {selectedUser.userName}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Payment Amount
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  max={selectedUser.amountPayableToUser}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Payment Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsAddPayment(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  onClick={() => {
                    // Add payment logic here
                    setIsAddPayment(false);
                    setRefresh((prev) => !prev);
                  }}
                >
                  Submit Payment
                </button>
              </div>
            </form>
          </div> */}
        </Modal>
      )}
    </div>
  );
};

export default AdvancesPayments;
