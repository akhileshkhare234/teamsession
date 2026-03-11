import React, { useState , useEffect} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEdit,
  faEye,
  faFilter,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import ExportComponent from "components/export/ExportComponent";
import PillButton from "components/button/Pills";
import Loader from "components/Loader";
// import NoData from "assets/No-Data.jpg";
import { useTranslation } from "react-i18next";
import NoData from "components/NoData";

// Utility function to capitalize the first letter of a string
// function capitalizeFirstLetter(value: string, _accessor?: string): string {
//   if (!value) return "";
//   return value.charAt(0).toUpperCase() + value.slice(1);
// }

interface Column<T> {
  header: string;
  accessor: keyof T;
  cell?: (row: T) => React.ReactNode; // <-- Add this
}

interface ReusableTableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: ("edit" | "delete" | "view")[];
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onRowClick?: (row: T) => void;
  onView?: (row: T) => void;
  onAddBtnClick?: () => void;
  theadHeight?: string;
  isExport?: boolean;
  isAdding?: boolean;
  isSearch?: boolean;
  loading?: boolean;
  itemsPerPages?: number;
  isPagination?: boolean;
  newPagination?: boolean;
  handleNextPage?: () => void;
  handlePrevPage?: () => void;
  pages?: number;
  totalPagess?: number;
  isFilter?: boolean;
  handleFilter?: () => void;
  filterButtonRef?: React.RefObject<HTMLDivElement>; // Add this new prop
   filterCount?: number; 
  isGenerateDocs?: boolean;
  handleGenerateDocs?: () => void;
  searchStyle?: string;
  // Add these new props for custom rendering
  customRowRenderer?: (row: T, columns: Column<T>[]) => React.ReactNode;
  customHeaderRenderer?: (columns: Column<T>[]) => React.ReactNode;
}

const DataTable = <T,>({
  columns,
  data,
  actions = [],
  onEdit,
  onDelete,
  onView,
  onAddBtnClick,
  onRowClick,
  filterCount = 0,  
  theadHeight,
  isExport = false,
  isAdding = false,
  isSearch = false,
  loading,
  itemsPerPages = 7,
  isPagination = true,
  newPagination = false,
  handleNextPage,
  handlePrevPage,
  handleFilter,
  pages = 0,
  totalPagess = 0,
  isFilter = false,
  filterButtonRef,
  isGenerateDocs = false,
  handleGenerateDocs,

  searchStyle = "w-full sm:w-64 h-7 px-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-600 dark:text-white",
  customRowRenderer,
  customHeaderRenderer,
}: ReusableTableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  console.log(setHasActiveFilters);
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPages);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc" | null;
  }>({ key: null, direction: null });
  const { t } = useTranslation();
  console.log("DataTable rendered with data:", totalPagess);

  const handleSort = (accessor: keyof T) => {
    setSortConfig((prev) => {
      if (prev.key === accessor) {
        const nextDirection =
          prev.direction === "asc"
            ? "desc"
            : prev.direction === "desc"
              ? null
              : "asc";
        return {
          key: nextDirection ? accessor : null,
          direction: nextDirection,
        };
      }
      return { key: accessor, direction: "asc" };
    });
  };
  // "border border-gray-300 rounded-md p-2 w-2 dark:bg-gray-600 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"

  const getSortedData = (rows: T[]) => {
    const { key, direction } = sortConfig;
    if (!key || !direction) return rows;
    return [...rows].sort((a, b) => {
      const aValue = a[key];
      const bValue = b[key];

      if (aValue == null) return 1;
      if (bValue == null) return -1;

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  const filteredData =
    data &&
    data.filter((row) =>
      columns.some((col) =>
        String(row[col.accessor])
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    );

  const sortedData = getSortedData(filteredData);

  const totalPages = Math.ceil(sortedData && sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData =
    sortedData && sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => setCurrentPage(page);
  const getPageNumbers = () => Array.from({ length: totalPages }, (_, i) => i + 1);
const handleAddClickEvent = () => {
  onAddBtnClick?.();
};


  const handleItemsPerPageChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setItemsPerPage(parseInt(e.target.value));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const trimmedValue = e.target.value.trim();
    setSearchTerm(e.target.value); // Keep the displayed value as-is for better UX
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };
  //fix for pagination issue
  useEffect(() => {
  if (totalPages > 0 && currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [totalPages, currentPage]);

  return (
    <div className="min-w-full inline-block align-middle">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <section className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start sm:items-center w-full sm:w-auto">
          {isSearch && (
            <div className="sm:w-72 w-32 relative">
              <div className="relative flex items-center">
                {/* <span className="absolute left-2 text-gray-500 dark:text-gray-400">
                  <FontAwesomeIcon icon={faSearch} className="text-xs" />
                </span> */}
                <input
                  type="text"
                  placeholder="Search..."
                 className={`${searchStyle} pl-7 bg-[#374151] text-black dark:text-white placeholder-gray-400 dark:placeholder-gray-300`}
                  style={{
                    height: "28px",
                    lineHeight: "28px",
                  }}
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="absolute right-2 text-gray-500 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    onClick={clearSearch}
                    aria-label="Clear search"
                  >
                    <FontAwesomeIcon
                      icon={faTimes}
                      className="text-xs w-4 h-4"
                    />
                  </button>
                )}
              </div>
            </div>
          )}
       {isFilter && (
  <div ref={filterButtonRef} className="w-full sm:w-28">
    <button
      onClick={handleFilter}
      className={`relative w-full flex items-center justify-center sm:justify-start gap-2 px-4 py-3 border rounded-md focus:outline-none
        ${
          filterCount > 0
            ? "bg-blue-100 dark:bg-[#1E3A8A] border-blue-400 dark:border-blue-500 text-black dark:text-white"
            : "bg-white border-gray-300 text-black dark:bg-gray-700 dark:text-white"
        }`}
    >
      {/* Green dot (inside button, left of icon) */}
      {filterCount > 0 && (
        <span className="absolute top-2 left-8 h-2 w-2 bg-green-500 rounded-full" />
      )}

      {/* Filter icon */}
      <FontAwesomeIcon
          icon={faFilter}
          className={`${hasActiveFilters ?"text-black dark:text-white" : ""}`}
        />

      {/* Filter text */}
      <span className="text-black dark:text-white">Filter</span>

      {/* Count badge (top-right) */}
      {filterCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
  {filterCount}
</span>
      )}
    </button>
  </div>
)}

</section>

        <div className="flex flex-row gap-4">
          {isAdding && (
            <PillButton variant="secondary" onClick={handleAddClickEvent} disabled={!navigator.onLine}>
              Add
            </PillButton>
          )}
          {isGenerateDocs && (
            <button
              onClick={handleGenerateDocs}
              className="flex items-center gap-2 bg-white  px-4  dark:bg-gray-700  rounded-md  focus:outline-none to-backgroundPrimary focus:ring-2 focus:ring-blue-500"
            >
              <FontAwesomeIcon
                icon={faDownload}
                className="gap-2"
              ></FontAwesomeIcon>{" "}
              Generate
            </button>
          )}
          {isExport && <ExportComponent data={filteredData} />}
        </div>
      </div>

      <div className="overflow-hidden border rounded-lg border-gray-300 dark:border-gray-900">
        {loading ? (
          <Loader />
        ) : (
          <>
            {sortedData && sortedData.length > 0 ? (
              <>
                <div
                  className={`overflow-x-auto ${theadHeight} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
                >
                  <table className="min-w-full rounded-xl border-separate border-spacing-0 dark:bg-gray-600 dark:text-white ">
                    <thead
                      className="sticky top-0 z-10 bg-gray-100 shadow dark:bg-gray-700 dark:text-white"
                      style={{
                        fontFamily: "Inter",
                        fontWeight: 500,
                        fontStyle: "normal",
                        fontSize: "14px",
                        letterSpacing: "0px",
                        lineHeight: "100%",
                      }}
                    >
                      {customHeaderRenderer ? (
                        customHeaderRenderer(columns)
                      ) : (
                        <tr>
                          {columns.map((col, index) => (
                            <th
                              key={index}
                              className="p-5 text-left text-sm font-medium text-gray-800 capitalize cursor-pointer dark:text-white"
                              onClick={() => handleSort(col.accessor)}
                              style={{
                                fontFamily: "Inter",
                                fontWeight: 500,
                                fontStyle: "normal",
                                fontSize: "16px",
                                letterSpacing: "0px",
                                lineHeight: "100%",
                              }}
                            >
                              {t(`common.tableHeaders.${col.header}`, {
                                defaultValue: col.header,
                              })}

                              {/* {t(col.header)}{" "} */}
                              {sortConfig.key === col.accessor &&
                                (sortConfig.direction === "asc"
                                  ? "▲"
                                  : sortConfig.direction === "desc"
                                    ? "▼"
                                    : "")}
                            </th>
                          ))}
                          {actions.length > 0 && (
                            <th
                              className="p-5 text-left text-sm font-medium text-gray-800 capitalize dark:text-white"
                              style={{
                                fontFamily: "Inter",
                                fontWeight: 500,
                                fontStyle: "normal",
                                fontSize: "16px",
                                letterSpacing: "0px",
                                lineHeight: "100%",
                              }}
                            >
                              Actions
                            </th>
                          )}
                        </tr>
                      )}
                    </thead>

                    {paginatedData && paginatedData.length > 0 ? (
                      <tbody>
                        {customRowRenderer
                          ? paginatedData.map((row) =>
                              customRowRenderer(row, columns)
                            )
                          : paginatedData.map((row, rowIndex) => (
                              <tr
                                key={rowIndex}
                                className="hover:bg-gray-200 dark:hover:bg-[#444444]"
                              >
                                {columns.map((col, colIndex) => (
                                  <td
                                    key={colIndex}
                                    className={`p-5 text-sm font-normal cursor-pointer dark:text-white`}
                                    onClick={() => onRowClick?.(row)}
                                  >
                                    {/* {col.cell                                     //email first letter issue
                                      ? col.cell(row)
                                      : capitalizeFirstLetter(
                                          String(row[col.accessor] ?? "-"),
                                          String(col.accessor)
                                        )} */}
                                          
                                        {col.cell                         
                                          ? col.cell(row)
                                         : String(row[col.accessor] ?? "-")}
                                  </td>
                                ))}

                                {actions.length > 0 && (
                                  <td className="p-5 dark:text-white">
                                    <div className="flex items-center gap-5">
                                      {actions.includes("edit") && onEdit && (
                                        <button onClick={() => onEdit(row)}>
                                          <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                      )}
                                      {actions.includes("delete") &&
                                        onDelete && (
                                          <button onClick={() => onDelete(row)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                          </button>
                                        )}
                                      {actions.includes("view") && onView && (
                                        <button onClick={() => onView(row)}>
                                          <FontAwesomeIcon icon={faEye} />
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                )}
                              </tr>
                            ))}
                      </tbody>
                    ) : null}
                  </table>
                </div>
                {/* {isPagination && (
                  <div className="flex items-center justify-between px-4 py-2 mt-1 bg-white border-t border-gray-200 dark:bg-gray-700">
                    <div className="flex items-center space-x-2 dark:text-white dark:bg-gray-700">
                      <select
                        id="small"
                        className="p-2 mb-0 text-sm pages dark:bg-gray-600 dark:text-white rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onChange={handleItemsPerPageChange}
                        defaultValue={itemsPerPage}
                      >
                        <option value="7">07</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <span className="text-sm font-medium text-gray-700 dark:text-white">
                        {t("button.showing")} {startIndex + 1} to{" "}
                        {Math.min(startIndex + itemsPerPage, sortedData.length)}{" "}
                        of {sortedData.length} {t("button.entries")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 dark:text-white dark:bg-gray-700">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t("button.previous")}
                      </button>
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === page
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage === totalPages || sortedData.length === 0
                        }
                        className="px-3 py-1 rounded-md bg-gray-100 disabled:opacity-50 dark:bg-gray-700 dark:text-white disabled:cursor-not-allowed"
                      >
                        {t("button.next")}
                      </button>
                    </div>
                  </div>
                )}
                {newPagination && (
                  <div className="flex items-center justify-end space-x-3 px-4 py-2 mt-1 bg-white border-t border-gray-200 dark:bg-gray-700">
                    <button
                      onClick={handlePrevPage}
                      disabled={pages === 0 || data.length === 0}
                      className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50 dark:text-white dark:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm">
                      Page {data.length === 0 ? 0 : pages + 1} of{" "}
                      {totalPagess || 0}
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={ data.length === 0}
                      className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50 dark:bg-gray-600 dark:text-white disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )} */}
              </>
            ) 
            : (
              <div className="w-full min-h-[300px] py-16 flex justify-center items-center bg-white dark:bg-gray-700">
                <NoData
                  className="mx-auto"
                  message={
                    isFilter
                      ? "No data available"
                      : searchTerm
                        ? "No results found for your search"
                        : "No data available"
                  }
                />
              </div>
            )}
          </>
        )}
         {isPagination && (
                  <div className="flex items-center justify-between px-4 py-2 mt-1 bg-white border-t border-gray-200 dark:bg-gray-700">
                    <div className="flex items-center space-x-2 dark:text-white dark:bg-gray-700">
                      <select
                        id="small"
                        className="p-2 mb-0 text-sm pages dark:bg-gray-600 dark:text-white rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onChange={handleItemsPerPageChange}
                        defaultValue={itemsPerPage}
                      >
                        <option value="7">07</option>
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                      <span className="text-sm font-medium text-gray-700 dark:text-white">
                        {t("button.showing")} {startIndex + 1} to{" "}
                        {Math.min(startIndex + itemsPerPage, sortedData.length)}{" "}
                        of {sortedData.length} {t("button.entries")}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 dark:text-white dark:bg-gray-700">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t("button.previous")}
                      </button>
                      {getPageNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1 rounded-md ${
                            currentPage === page
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={
                          currentPage === totalPages || sortedData.length === 0
                        }
                        className="px-3 py-1 rounded-md bg-gray-100 disabled:opacity-50 dark:bg-gray-700 dark:text-white disabled:cursor-not-allowed"
                      >
                        {t("button.next")}
                      </button>
                    </div>
                  </div>
                )}
                {newPagination && (
                  <div className="flex items-center justify-end space-x-3 px-4 py-2 mt-1 bg-white border-t border-gray-200 dark:bg-gray-700">
                    <button
                      onClick={handlePrevPage}
                      disabled={pages < 0 || (data.length === 0 && pages === 0) || pages === 0}
                      className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50 dark:text-white dark:bg-gray-600 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {/* Dynamic page numbers */}
                    {/* <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPagess || 0 }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => handlePageChange(i + 1)}
                          className={`px-3 py-1 rounded ${
                            (pages + 1) === (i + 1)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-white"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div> */}
                    <span className="text-sm">
                      Page {data.length === 0 ? 0 : pages + 1} 
                    </span>
                    <button
                      onClick={handleNextPage}
                      disabled={data.length === 0}
                      className="bg-gray-200 px-3 py-1 rounded disabled:opacity-50 dark:bg-gray-600 dark:text-white disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
      </div>
    </div>
  );
};

export default DataTable;
