/* eslint-disable react-hooks/exhaustive-deps */
import DataTable from "components/DataTable";
import React, { useEffect,useState} from "react";
import httpClient from "services/network/httpClient";

import GenericModal from "components/Modal";
import ExpenditureDetails from "./ExpenditureDetails";
import moment from "moment";
import UpdateExpenditure from "./UpdateExpenditure";
import Loader from "components/Loader";
import Filter from "components/filter/Filter";
// import PDFDownloadButton from "components/button/PDFDownloadButton";
import AuthManager from "services/auth/AuthManager";
import { downloadFile } from "utility/downloadPDF ";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import appConfig from "services/config";
// import { url } from "inspector";

interface ExpenditureProps {
  id: number;
  username?: string;
  amount: number;
  amountUnit: string;
  spentDate: string | number | Date;
  submitDate: string | number | Date;
  reimbursementType: string;
  description: string;
  status: string;
  imageUrls: string;
  clientName: string;
  approvedAmount: number;
  differenceAmount?: number;
  comment?: string;
}

const Expenditure = () => {
  const [expenditure, setExpenditure] = React.useState<ExpenditureProps[]>([]);
  const [isView, setIsView] = React.useState(false);
  const [viewData, setViewData] = React.useState<ExpenditureProps>();
  const [isEdit, setIsEdit] = React.useState(false);
  const [editData, setEditData] = React.useState<ExpenditureProps>();
  const [loading, setLoading] = React.useState(false);
 //const filterButtonRef = useRef<HTMLButtonElement>(null);
 // const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [size, setSize] = React.useState(1000);
  const [totalPages, setTotalPages] = React.useState(1);
  const [isFilter, setIsFilter] = React.useState(false);
  const [isGenerateDocs, setIsGenerateDocs] = React.useState(false);
  //const [isGenerateDocsOpen, setIsGenerateDocsOpen] = React.useState(false);
  const [filterCount, setFilterCount] = useState<number>(0);
  console.log(filterCount);
  // const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [filterPayload, setFilterPayload] = React.useState<any>(null);

  const filterRef = React.useRef<HTMLDivElement>(null);
  const generateDocsRef = React.useRef<HTMLDivElement>(null);
  const [docsLoading, setDocsLoading] = React.useState(false);
  const [filterLoading, setFilterLoading] = React.useState(false);

const [hasActiveFilters, setHasActiveFilters] = React.useState(false);



  const baseURL = appConfig.getBaseUrl();

  // Add click outside handler for dropdowns
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Check if filter dropdown should be closed
      if (
        isFilter &&
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilter(false);
      }

      // Check if generate docs dropdown should be closed
      if (
        isGenerateDocs &&
        generateDocsRef.current &&
        !generateDocsRef.current.contains(event.target as Node)
      ) {
        setIsGenerateDocs(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFilter, isGenerateDocs]);

  const token = AuthManager.getToken();

  const getExpenditure = () => {
    setLoading(true);
    httpClient
      .get(`reimbursements/all?page=${page}&size=${size}`)
      .then((res: any) => {
        const content = res.value.content || [];
        setPage(res.value.pageNumber || 0);
        setSize(res.value.pageSize || 10);
        const store = content.map((item: any) => ({
          ...item,
          reimbursementType:
            item.reimbursementType || item.otherType || "Other",
          spentDate: moment(item.spentDate).format("YYYY-MM-DD"),
          // spentDate: new Date(item.spentDate).toString().split("T")[0],
          submitDate: moment(item.submitDate).format("YYYY-MM-DD"),
          status:
            item.status === 0
              ? "PENDING"
              : item.status === 1
                ? "APPROVED"
                : "REJECTED",
        }));
        setExpenditure(store);
        setTotalPages(res.value.totalPages || 1); // adjust based on API response structure
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (filterPayload) {
      submit(); // reuse last filter payload
    } else {
      getExpenditure();
    }
  }, [page, size]); // only reruns when pagination changes

  const handleView = (row: any) => {
    console.log("View Data", row);
    setIsView(true);
    setViewData(row);
  };

  const handleEdit = (row: any) => {
    console.log("Edit Data", row);
    setIsEdit(true);
    setEditData(row);
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 0) setPage((prev) => prev - 1);
  };

  const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-[#FFA500]", // Orange
    APPROVED_FULL: "bg-[#28A745]", // Green
    APPROVED_PARTIAL: "bg-[#20C997]", // Teal
    REJECTED: "bg-red-500", // Red
  };

  const getStatusDisplay = (row: ExpenditureProps) => {
    if (row.status === "PENDING") {
      return { text: "Pending", color: STATUS_COLORS.PENDING };
    }

    if (row.status === "APPROVED") {
      const isPartial =
        row.differenceAmount !== undefined && row.differenceAmount > 0;

      return {
        text: isPartial ? "Approved(Partial)" : "Approved",
        color: isPartial
          ? STATUS_COLORS.APPROVED_PARTIAL
          : STATUS_COLORS.APPROVED_FULL,
      };
    }

    if (row.status === "REJECTED") {
      return { text: "Rejected", color: STATUS_COLORS.REJECTED };
    }

    return { text: "Unknown", color: "bg-gray-400" };
  };

  const tableColumn = [
    { accessor: "username" as keyof ExpenditureProps, header: "User Name" },
    { accessor: "clientName" as keyof ExpenditureProps, header: "Client Name" },
    {
      accessor: "reimbursementType" as keyof ExpenditureProps,
      header: "Category Type",
    },
    { accessor: "spentDate" as keyof ExpenditureProps, header: "Spent Date" },
    { accessor: "submitDate" as keyof ExpenditureProps, header: "Submit Date" },
    { accessor: "amount" as keyof ExpenditureProps, header: "Submit Amount" },
    {
      accessor: "approvedAmount" as keyof ExpenditureProps,
      header: "Approved Amount",
    },
    {
      accessor: "differenceAmount" as keyof ExpenditureProps,
      header: "Difference Amount",
    },
    {
      accessor: "status" as keyof ExpenditureProps,
      header: "Status",
      cell: (row: ExpenditureProps) => {
        const { text, color } = getStatusDisplay(row);
        const textColor = "text-white";

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${color} ${textColor}`}
          >
            {text}
          </span>
        );
      },
    },
  ];

  const handleFilter = () => {
    setIsFilter(true);
  };

  const submit = (filterData: any = filterPayload) => {
    setIsFilter(false);
    // setLoading(true);
    setFilterLoading(true);

    if (!filterData) return;

    const params = new URLSearchParams();
   let activeFilters = 0;
  
    if (filterData.fromDate) {
    params.append("fromDate", `${filterData.fromDate}T00:00:00`);
    activeFilters++;
  }
  if (filterData.toDate) {
    params.append("toDate", `${filterData.toDate}T23:59:59`);
    activeFilters++;
  }
  if (filterData.typeId) {
    params.append("typeId", filterData.typeId);
    activeFilters++;
  }
  if (filterData.status) {
    params.append("status", filterData.status);
    activeFilters++;
  }
  if (filterData.month) {
    params.append("month", filterData.month);
    activeFilters++;
  }
  if (filterData.year) {
    params.append("year", filterData.year);
    activeFilters++;
  }
  if (filterData.userId) {
    params.append("userId", filterData.userId);
    activeFilters++;
  }

    // Always add pagination
    params.append("page", page.toString());
    params.append("size", size.toString());

 // Save current filters
  setFilterPayload(filterData);
  if(activeFilters>0)
  setHasActiveFilters(true);
  setFilterCount(activeFilters);
  // setCurrentFilters(newFilters);
    httpClient
      .get(`reimbursements/all?${params.toString()}`)
      .then((response: any) => {
        const content = response.value.content || [];
        const store = content.map((item: any) => ({
          ...item,
          reimbursementType:
            item.reimbursementType || item.otherType || "Other",
          spentDate: moment(item.spentDate).format("YYYY-MM-DD"),
          submitDate: moment(item.submitDate).format("YYYY-MM-DD"),
          status:
            item.status === 0
              ? "PENDING"
              : item.status === 1
                ? "APPROVED"
                : "REJECTED",
        }));
        setExpenditure(store);
        setTotalPages(response.value.totalPages || 1);
        // setIsFilterOpen(true);
      })
      .catch((error: any) => {
        console.error("Error fetching filtered data:", error);
      })
      .finally(() => {
        setLoading(false);
        setFilterLoading(false);
      });
  };

  const docSubmit = async (filterData: any) => {
    setDocsLoading(true);
    console.log("Filter Data for Docs", filterData);
    const fromDates = filterData.fromDate + "T00%3A00%3A00";
    const toDates = filterData.toDate + "T23%3A59%3A59";
    await downloadFile(
      `${baseURL}/reimbursements/download?${filterData.fromDate && "fromDate=" + fromDates}&${filterData.toDate && "toDate=" + toDates}&${filterData.typeId && "typeId=" + filterData.typeId}&${filterData.status && "status=" + filterData.status}&${filterData.month && "month=" + filterData.month}&${filterData.year && "year=" + filterData.year}&${filterData.userId && "userId=" + filterData.userId}`,
      "SampleFile.xlsx",
      filterData,
      token ?? ""
    );
    setIsGenerateDocs(false);
    setLoading(false);
    setDocsLoading(false);
  };
  // console.log("token", token);

  const clearFilters = () => {
  setHasActiveFilters(false);
  setFilterCount(0);
  // setCurrentFilters({});
  setFilterPayload(null);

  setIsFilter(false);
  setLoading(true);

  // Fetch default data
  getExpenditure();
};
  return (
    <div className="flex flex-col w-full p-1 sm:overflow-hidden overflow-y-auto">
      <div className="relative min-h-[500px]"> {/* Added min-h-[500px] to prevent collapse */}
        {loading ? (
          <Loader />
        ) : (
          <>
            <DataTable
              columns={tableColumn}
              data={expenditure}
              theadHeight="h-[calc(100vh-205px)]"
              actions={["edit", "view"]}
              isSearch={true}
              onView={handleView}
              onEdit={handleEdit}
              isExport={true}
              isPagination={true}
              newPagination={false}
              pages={page}
              isFilter={true}
              handleFilter={handleFilter}
              totalPagess={totalPages}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
              filterCount={filterCount}  
              itemsPerPages={size}
              isGenerateDocs={true}
              handleGenerateDocs={() => {
                setIsGenerateDocs(true);
                // Close filter dropdown if it's open
                setDocsLoading(false);
              }}
            />
          </>
        )}
         
        {/* Filter Dropdown */}
        {isFilter && (
          <div
            ref={filterRef}
            className="absolute top-14  z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 w-[340px] sm:w-[400px] transition-all duration-200 overflow-auto"
            style={{
              opacity: isFilter ? 1 : 0,
              transform: isFilter ? "translateY(0)" : "translateY(-10px)",
              maxHeight: "70vh", // Ensure dropdown never exceeds viewport
            }}
          >
            <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white">
                Filter Expenditure
              </h3>
               {hasActiveFilters && (
            <button
             onClick={clearFilters}
             className="ml-auto mr-3 text-xs bg-blue-500 text-white px-2 py-0.5 rounded flex items-center"  >
             Clear All Filters
             <FontAwesomeIcon icon={faTimes} className="ml-1" />
             </button>
            )}
              <button
                onClick={() => setIsFilter(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-4">
              <Filter submit={submit} loading={filterLoading} />
            </div>
          </div>
        )}

        {/* Generate Documents Dropdown - now styled similar to Filter */}
        {isGenerateDocs && (
          <div
            ref={generateDocsRef}
            className="absolute top-12 right-4 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 w-[340px] sm:w-[400px] transition-all duration-200"
            style={{
              opacity: isGenerateDocs ? 1 : 0,
              transform: isGenerateDocs ? "translateY(0)" : "translateY(-10px)",
              maxHeight: "70vh", // Ensure dropdown never exceeds viewport
            }}
          >
            <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-medium text-gray-800 dark:text-white">
                Generate Documents
              </h3>
              <button
                onClick={() => setIsGenerateDocs(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="p-4">
              <Filter submit={docSubmit} buttonName="Generate" loading={docsLoading} />
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {isView && (
        <GenericModal
          isOpen={isView}
          onClose={() => setIsView(false)}
          header={`${viewData?.username}  Expenditure Details`}
          customWidth="max-w-3xl"
        >
          {viewData && (
            <ExpenditureDetails
              data={{
                ...viewData,
                name: (viewData as any).name || "",
                imageUrls: viewData.imageUrls
                  ? Array.isArray(viewData.imageUrls)
                    ? viewData.imageUrls
                    : viewData.imageUrls.split(",").map((url) => url.trim())
                  : [],
              }}
              onClose={() => setIsView(false)}
            />
          )}
        </GenericModal>
      )}

      {/* Edit Modal */}
      {isEdit && (
        <GenericModal
          isOpen={isEdit}
          onClose={() => setIsEdit(false)}
          header="Edit Expenditure"
          customWidth="max-w-4xl"
        >
          {editData && (
            <UpdateExpenditure
              editData={{ ...editData }}
              reload={getExpenditure}
              onClose={() => setIsEdit(false)}
            />
          )}
        </GenericModal>
      )}
    </div>
  );
};

export default Expenditure;
// function then(arg0: (res: any) => void) {
//   throw new Error("Function not implemented.");
// }
