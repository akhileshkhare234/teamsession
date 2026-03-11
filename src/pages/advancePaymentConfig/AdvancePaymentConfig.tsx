/* eslint-disable react-hooks/exhaustive-deps */
// import DataTable from "components/DataTable";
import GenericModal from "components/Modal";
import React, { useEffect, useRef } from "react";
import httpClient from "services/network/httpClient";
import AddConfig from "./AddConfig";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

interface AddAdvanceConfigProps {
    minAmount?: number;
    maxAmount?: number;
    maxDescriptionLength?: number;
    ttlMs?: number;
    // actions?: React.ReactNode; // Placeholder for actions column
}

const AdvancePaymentConfig = () => {
 const [config, setConfig] = React.useState<AddAdvanceConfigProps[]>([]);
 const [isAdding, setIsAdding] = React.useState(false);
 const [AddConfigData, setAddConfigData] = React.useState<AddAdvanceConfigProps>({});

  const getPaymentConfig = async () => {
    const storeData = [] as AddAdvanceConfigProps[];
    httpClient
      .get("/advance-config/app-config")
      .then((response: any) => {
        console.log("Advance Payment Config Data:", response);
        console.log("Advance Payment Config Data:", response.value);
        if (!response || !response.value) {
          console.error("No data found in response");
          return;
        }
        setAddConfigData(response.value);
        storeData.push(response.value);
        setConfig(storeData);
        // Handle the response data as needed
      })
      .catch((error) => {
        console.error("Error fetching advance payment config:", error);
      });
  };

  const hasFetched = useRef(false);

 const tableData: { header: string; accessor: keyof AddAdvanceConfigProps | "action" }[] = [
    { accessor: "minAmount", header: "Minimum Amount" },
    { accessor: "maxAmount", header: "Maximum Amount" },
    { accessor: "maxDescriptionLength", header: "Description Length" },
    { accessor: "ttlMs", header: "TTL (ms)" },
    { accessor: "action", header: "Action" }, // Add action column
  ];

  

  useEffect(() => {
    if (!hasFetched.current) {
      getPaymentConfig();
      hasFetched.current = true;
    }
  }, []);
  return (
    <div className="flex flex-col items-center justify-center mt-10">
     
    <table className="w-full mt-4 table-auto">
      <thead>
        <tr>
          {tableData.map((column) => (
            <th
              key={column.accessor}
              className="p-2 border-b text-left font-semibold bg-gray-50 dark:bg-gray-600 dark:text-white"
            >
              {column.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {config.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {tableData.map((column) => (
              <td
                key={column.accessor}
                className="p-2 border-b text-left align-middle"
              >
                {column.accessor === "action" ? (
                  <button
                    onClick={() => {
                      // Handle edit/view action
                      setIsAdding(true);
                      setAddConfigData(row);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    title="Edit"
                  >
                   <FontAwesomeIcon 
                     icon={faEdit}
                     className="text-xs w-4 h-4"
                     />
                  </button>
                ) : (
                  row[column.accessor as keyof AddAdvanceConfigProps]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

    {
      isAdding && (
        <GenericModal
        isOpen={isAdding}
        onClose={() => setIsAdding(false)}
        header="Update Config"
      >
       <AddConfig
        onSuccess={() => {
          setIsAdding(false);
          getPaymentConfig();
        }}
        dataValue={AddConfigData}
      ></AddConfig>
      </GenericModal>
      )
    }
    </div>
  );
}
export default AdvancePaymentConfig;