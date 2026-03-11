import DataTable from "components/DataTable";
import React, { useState } from "react";
import GenericModal from "components/Modal";

import SessionAll from "../sessions/SessionAll";
import Loader from "components/Loader";
import NoData from "assets/No-Data.jpg";

type ProductItem = {
  userId: number;
  employeeId: number;
  employeeName: string;
  city: string;
  completedServices: number;
  pendingServices: number;
};
interface EmployeeProps {
  taskData: ProductItem[];
  completedServices?: number;
  pendingServices?: number;
  filterParams?: any;
  loading?: boolean;
}

const columns: { header: string; accessor: keyof ProductItem }[] = [
  { header: "employee", accessor: "employeeName" },
  { header: "city", accessor: "city" },
  { header: "completed ", accessor: "completedServices" },
  { header: "pending ", accessor: "pendingServices" },
];

const EmployeeTasks = ({ taskData, filterParams, loading }: EmployeeProps) => {
  const [isView, setIsView] = useState(false);
  const [viewData, setViewData] = useState<ProductItem>();

  console.log(taskData);

  const handleView = (row: any) => {
    setIsView(true);
    console.log(row.userId);
    setViewData(row);
  };

  // if (!loading && ( !taskData || taskData.length === 0)) {
  //   return (
  //     <div className="h-[calc(60vh-100px)] flex flex-col items-center justify-center space-y-4">
  //       <NoData></NoData>
  //       <p className="text-gray-600 font-medium">No data found</p>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full">
      {loading ? (
        <Loader></Loader>
      ) : taskData && taskData.length > 0 ? (
        <DataTable
          columns={columns}
          data={taskData}
          theadHeight="h-[calc(100vh-435px)]"
          actions={["view"]}
          onView={handleView}
          onRowClick={handleView}
          isSearch={false}
        ></DataTable>
      ) : (
        <div className="h-[calc(60vh-100px)] flex flex-col items-center justify-center space-y-4">
          <NoData></NoData>
          <p className="text-gray-600 font-medium">No data found</p>
        </div>
      )}
      {isView && (
        <GenericModal
          isOpen={isView}
          onClose={() => setIsView(false)}
          header={`${viewData?.employeeName}'s Sessions`}
          customWidth="calc(100vw - 32px)"
          customHeight="calc(100vh - 32px)"
        >
          <div className="flex flex-col h-full px-3">
            {viewData && (
              <SessionAll
                data={viewData}
                filterParams={filterParams}
              ></SessionAll>
            )}
          </div>
        </GenericModal>
      )}
    </div>
  );
};
export default EmployeeTasks;
