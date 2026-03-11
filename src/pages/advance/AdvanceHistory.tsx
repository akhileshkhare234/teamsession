/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useRef } from "react";
import httpClient from "services/network/httpClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faEdit,
  faTimes,
  faFilter,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { showToast } from "components/Toaster";
import AdvanceFilter from "./AdvanceFilter";
import { useOnClickOutside } from "hooks/useOnClickOutside";

interface AdvanceItem {
  historyId: number;
  userId: number;
  userName: string;
  timestamp: number;
  addedAmount: number | null; // Allow null for empty values
  finalAmount: number;
  isSettlement: boolean;
  // remainingAdvance: number;
  entryType: string;
  // message: string;
  description: string;
  newDescription?: string;
  createdByAdmin?: boolean;
  id?: number; // Optional ID for the advance item
  // isSettlement?: boolean;
}

interface AdvanceHistoryProps {
  id: string;
  onSuccess: () => void;
  onClose: () => void;
  minAmount: number;
  maxAmount: number;
  maxDescriptionLength: number;
}

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-IN");
};

const AdvanceHistory: React.FC<AdvanceHistoryProps> = ({
  id,
  onSuccess,
  onClose,
  minAmount,
  maxAmount,
  maxDescriptionLength,
}) => {
  const [data, setData] = useState<AdvanceItem[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editRow, setEditRow] = useState<AdvanceItem | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // For tracking active filters and displaying indicators
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);
  const [filterCount, setFilterCount] = useState<number>(0);

  // Refs for handling click outside filter dropdown
  const filterRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);

  // Close filter dropdown when clicking outside
  useOnClickOutside([filterRef, filterButtonRef], () => setIsFilterOpen(false));

  const fetchAdvanceHistory = (queryParams: URLSearchParams) => {
    setLoading(true);

    // Always include the userId
    if (id && !queryParams.has("userId")) {
      queryParams.append("userId", id);
    }

    const endpoint = `/advances/filter?${queryParams.toString()}`;
    console.log("API endpoint:", endpoint);

    httpClient
      .get(endpoint)
      .then((res: any) => {
        console.log("API response:", res);
        if (res?.value?.length > 0) {
          
          setData(res.value);
        } else {
          setData([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch advances", err);
        showToast("Failed to fetch advance history", "error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // Initial load - just fetch with userId
    const initialParams = new URLSearchParams();
    initialParams.append("userId", id);
    fetchAdvanceHistory(initialParams);
  }, [id]);

  // Handle filter submission from the form
  const handleFilterSubmit = (formData: any) => {
    // Create URL parameters object
    const queryParams = new URLSearchParams();
    let appliedFiltersCount = 0;

    // Always include the userId
    queryParams.append("userId", id);

    // Convert fromDate to timestamp if present
    if (formData.fromTimestamp) {
      const fromDate = new Date(formData.fromTimestamp);
      fromDate.setHours(0, 0, 0, 0);
      queryParams.append("fromTimestamp", fromDate.getTime().toString());
      appliedFiltersCount++;
    }

    // Convert toDate to timestamp if present
    if (formData.toTimestamp) {
      const toDate = new Date(formData.toTimestamp);
      toDate.setHours(23, 59, 59, 999);
      queryParams.append("toTimestamp", toDate.getTime().toString());
      appliedFiltersCount++;
    }

    // Add isSettlement if selected
    if (formData.isSettlement) {
      queryParams.append(
        "isSettlement",
        formData.isSettlement === "true" ? "true" : "false"
      );
      appliedFiltersCount++;
    }

    // Add createdByAdmin if selected
    if (formData.createdByAdmin) {
      queryParams.append(
        "createdByAdmin",
        formData.createdByAdmin === "true" ? "true" : "false"
      );
      appliedFiltersCount++;
    }

    // Set filter indicator state
    setHasActiveFilters(appliedFiltersCount > 0);
    setFilterCount(appliedFiltersCount);
    setIsFilterOpen(false);

    console.log("Filter parameters:", queryParams.toString());
    fetchAdvanceHistory(queryParams);
  };

  const clearFilters = () => {
    // Reset to just the userId
    const queryParams = new URLSearchParams();
    queryParams.append("userId", id);

    setHasActiveFilters(false);
    setFilterCount(0);
    fetchAdvanceHistory(queryParams);
    setIsFilterOpen(false);
  };

  const handleEditClick = (index: number) => {
    console.log("Edit clicked for index:", index);
    console.log("Current data:", data);
    console.log("Current row data:", data[index]);
    setEditIndex(index);
    setEditRow({
      ...data[index],
      newDescription: data[index].description,
    });
  };

  const handleCancelClick = () => {
    setEditIndex(null);
    setEditRow(null);
  };

  const handleSaveClick = (index: number) => {
    if (!editRow) return;

    // Final validation before saving
    let hasError = false;
    const errors: { amount?: string; description?: string } = {};

    // Require amount to be non-null and validate value
    if (editRow.addedAmount === null || editRow.addedAmount === 0) {
      errors.amount = `Amount field is required`;
      hasError = true;
    } else {
      const numAmount = Number(editRow.addedAmount);
      if (isNaN(numAmount) || numAmount < minAmount || numAmount > maxAmount) {
        errors.amount = `Please enter a valid amount between ${minAmount} and ${maxAmount}`;
        hasError = true;
      }
    }

    // Require description to be non-empty
    if (!editRow.newDescription || editRow.newDescription.trim() === '') {
      errors.description = `Description field is required`;
      hasError = true;
    } else if (editRow.newDescription.length > maxDescriptionLength) {
      errors.description = `Description cannot exceed ${maxDescriptionLength} characters`;
      hasError = true;
    }

    // Don't proceed if there are errors
    if (hasError) {
      setEditErrors(errors);
      return;
    }

    // Don't update local state yet, wait for server response
    // Only prepare the payload and send to server
    const payload = {
      userId: editRow.userId,
      historyId: editRow.id,
      newAmount: editRow.addedAmount, // Amount is now required and validated
      newDescription: editRow.newDescription || editRow.description, // Description is now required
      createdByAdmin: editRow.createdByAdmin || true,
      isSettlement: editRow.isSettlement || false,
    };

    httpClient
      .put(`/advances/update-latest-transaction`, payload)
      .then((res: any) => {
        console.log("Update transaction response:", res);
        if (res.success) {
          // Only update local state after successful server update
          const updated = [...data];
          updated[index] = editRow;
          setData(updated);
          
          showToast("Advance transaction updated successfully", "success");
          onClose();
          onSuccess(); // Refresh data from server
        } else {
          // Display the specific error message from the response
          const errorMessage =
            res?.error?.message || "You can't update multiple times ";
          showToast(errorMessage, "error");
          
          // Reset edit mode but don't update data
          setEditIndex(null);
          setEditRow(null);
        }
      })
      .catch((err) => {
        console.error("Failed to update advance transaction:", err);

        // Check for specific error message in different response formats
        let errorMessage = "Failed to update advance transaction";

        if (err.response?.data?.message) {
          // Standard API error format
          errorMessage = err.response.data.message;
        } else if (err.response?.data?.error?.message) {
          // Nested error object format
          errorMessage = err.response.data.error.message;
        } else if (
          err.message &&
          err.message.includes("Only the latest settlement")
        ) {
          // Direct error message
          errorMessage = err.message;
        } else if (
          typeof err === "string" &&
          err.includes("Only the latest settlement")
        ) {
          // String error
          errorMessage = err;
        }

        // Show the extracted error message
        showToast(errorMessage, "error");
        
        // Reset edit mode but don't update data
        setEditIndex(null);
        setEditRow(null);
      })
      .finally(() => setLoading(false));
  };

  const [editErrors, setEditErrors] = useState<{ amount?: string; description?: string }>({
    amount: undefined,
    description: undefined,
  });

  const handleFieldChange = (
    field: keyof AdvanceItem | "newDescription",
    value: string | number
  ) => {
    if (!editRow) return;
    let errorMsg = "";
    if (field === "addedAmount") {
      // Check for empty values
      if (value === "" || value === null || value === 0) {
        errorMsg = "Amount field is required";
        setEditErrors((prev) => ({ ...prev, amount: errorMsg }));
        setEditRow({
          ...editRow,
          [field]: value === 0 ? 0 : null, // Store null or 0 based on input
        });
        return;
      }
      
      const numValue = Number(value);
      // Validate values
      if (isNaN(numValue)) {
        errorMsg = "Amount must be a number";
      } else if (numValue === 0) {
        errorMsg = "Amount cannot be zero";
      } else if (numValue < minAmount) {
        errorMsg = `Amount must be at least ${minAmount}`;
      } else if (numValue > maxAmount) {
        errorMsg = `Amount must be less than or equal to ${maxAmount}`;
      }
      setEditErrors((prev) => ({ ...prev, amount: errorMsg }));
      setEditRow({
        ...editRow,
        [field]: numValue,
      });
    } else if (field === "newDescription") {
      const stringValue = String(value);
      // Validate description
      if (!stringValue || stringValue.trim() === '') {
        errorMsg = "Description field is required";
      } else if (stringValue.length > maxDescriptionLength) {
        errorMsg = `Description cannot exceed ${maxDescriptionLength} characters`;
      }
      setEditErrors((prev) => ({ ...prev, description: errorMsg }));
      setEditRow({
        ...editRow,
        [field]: stringValue,
      });
    } else {
      setEditRow({
        ...editRow,
        [field]: value,
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-[900px] mx-auto min-h-[calc(100vh-300px)]">
      <div className="mb-4 flex justify-end items-center">
        {/* <h2 className="text-xl font-semibold dark:text-white">
          Advance History
        </h2> */}
        <div className="relative">
          <button
            ref={filterButtonRef}
            type="button"
            className={`justify-center border border-gray-300 dark:border-gray-600 ${
              hasActiveFilters
                ? "bg-blue-100 dark:bg-[#1E3A8A] border-blue-400 dark:border-blue-500 text-black dark:text-white"
                : "dark:bg-gray-700"
            } text-gray-800 dark:text-white rounded-lg px-4 py-2 transition-shadow duration-300 z-10 flex items-center space-x-2 relative`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span className="relative">
              <FontAwesomeIcon icon={faFilter} />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-800"></span>
              )}
            </span>
            <span className="text-black dark:text-white">Filter</span>

            {/* Filter Badge */}
            {hasActiveFilters && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {filterCount}
              </span>
            )}
          </button>

          {isFilterOpen && (
            <div
              ref={filterRef}
              className="absolute top-12 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 w-[340px] sm:w-[400px] transition-all duration-200"
              style={{
                opacity: isFilterOpen ? 1 : 0,
                transform: isFilterOpen ? "translateY(0)" : "translateY(-10px)",
              }}
            >
              <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-white">
                  Filter Advance History
                </h3>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded flex items-center"
                    >
                      Clear All Filters
                      <FontAwesomeIcon icon={faXmark} className="ml-1" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <AdvanceFilter
                  submit={handleFilterSubmit}
                  hideUserField={true}
                  userId={id}
                  loading={isLoading}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-600">Loading...</p>
      ) : (
        <div className="overflow-x-auto border rounded shadow">
          <table className="min-w-full rounded-xl border-separate border-spacing-0 dark:bg-gray-600 dark:text-white">
            <thead className="sticky top-0 z-10 bg-gray-100 shadow dark:bg-gray-700 dark:text-white">
              <tr>
                <th className="p-5 text-left text-sm font-medium text-gray-800 capitalize cursor-pointer dark:text-white">
                  Date
                </th>
                <th className="p-5 text-left text-sm font-medium text-gray-800 capitalize cursor-pointer dark:text-white">
                  {/* Added Amount */}
                  Amount
                </th>
                <th className="p-5 text-left text-sm font-medium text-gray-800 capitalize cursor-pointer dark:text-white">
                  Final Amount
                </th>
                <th className="p-5 text-left text-sm font-medium text-gray-800 capitalize cursor-pointer dark:text-white">
                  {/* Is Settlement */}
                  Entry Type
                </th>
                <th className="p-5 text-left text-sm font-medium text-gray-800 capitalize cursor-pointer dark:text-white">
                  {/* Entry Type */}
                  Added By
                </th>
                <th className="p-5 text-left text-sm font-medium text-gray-800 capitalize cursor-pointer dark:text-white">
                  Description
                </th>
                <th className="p-5 text-left text-sm font-medium text-gray-800 capitalize cursor-pointer dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              className="divide-y divide-gray-300 bg-[#FCFCFC] dark:bg-gray-700 dark:text-white"
              style={{
                fontFamily: "Inter",
                fontWeight: 500,
                fontStyle: "normal",
                fontSize: "16px",
                letterSpacing: "0px",
                lineHeight: "19px",
              }}
            >
              {data.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-0">
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-1">
                        No data found
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-center mb-4">
                        {hasActiveFilters
                          ? "No records match your current filter criteria. Try adjusting your filters."
                          : "No advance history records available for employee."}
                      </p>
                      {hasActiveFilters && (
                        <button
                          onClick={clearFilters}
                          className="text-sm bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((row, index) => (
                  <tr
                    key={row.historyId}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    {editIndex === index ? (
                      <>
                        <td className="p-5 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          {formatDate(editRow!.timestamp)}
                        </td>
                        <td className="p-2 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          <input
                            type="number"
                            className={`w-full px-1 py-1 border rounded ${editErrors.amount ? 'border-red-500' : ''}`}
                            value={editRow?.addedAmount === null ? '' : editRow?.addedAmount}
                            min={minAmount}
                            max={maxAmount}
                            onChange={(e) =>
                              handleFieldChange("addedAmount", e.target.value || '')
                            }
                            required
                          />
                          {editErrors.amount && (
                            <div className="text-xs text-red-500">{editErrors.amount}</div>
                          )}
                        </td>
                        <td className="p-5 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          {editRow?.finalAmount}
                        </td>
                        <td className="p-5 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          {editRow?.isSettlement ? "Settlement" : "Advance"}
                        </td>
                        <td className="p-5 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          {/* {editRow?.createdByAdmin ? "Admin" : "User"} */}
                          {row.createdByAdmin ? "Admin(Self)" : row.userName}
                        </td>
                        <td className="p-2 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          <input
                            type="text"
                            className={`w-full px-1 py-1 border rounded ${editErrors.description ? 'border-red-500' : ''}`}
                            value={editRow?.newDescription ?? editRow?.description ?? ""}
                            maxLength={maxDescriptionLength}
                            onChange={(e) =>
                              handleFieldChange(
                                "newDescription",
                                e.target.value
                              )
                            }
                            required
                          />
                          {editErrors.description && (
                            <div className="text-xs text-red-500">{editErrors.description}</div>
                          )}
                        </td>
                        <td className="p-2 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          <button
                            onClick={() => {
                              // Validate fields before saving
                              let hasErrors = false;
                              const errors: {amount?: string, description?: string} = {};
                              
                              // Check amount
                              if (editRow?.addedAmount === null || editRow?.addedAmount === 0) {
                                errors.amount = "Amount field is required";
                                hasErrors = true;
                              } else if (typeof editRow?.addedAmount === 'number') {
                                const numValue = Number(editRow.addedAmount);
                                if (numValue < minAmount || numValue > maxAmount) {
                                  errors.amount = `Please enter a valid amount between ${minAmount} and ${maxAmount}`;
                                  hasErrors = true;
                                }
                              }
                              
                              // Check description
                              if (!editRow?.newDescription || editRow?.newDescription.trim() === '') {
                                errors.description = "Description field is required";
                                hasErrors = true;
                              }
                              
                              if (hasErrors) {
                                setEditErrors(errors);
                              } else if (!editErrors.amount && !editErrors.description) {
                                handleSaveClick(index);
                              }
                            }}
                            className="text-blue-600 hover:underline mr-3"
                            disabled={!!editErrors.amount || !!editErrors.description}
                          >
                            <FontAwesomeIcon icon={faSave} />
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="text-red-600 hover:underline"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="p-5 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          {formatDate(row.timestamp)}
                        </td>
                        <td className="p-5 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          {row.addedAmount}
                        </td>
                        <td className="p-5 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          {row.finalAmount}
                        </td>
                        <td className="p-5 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          {row.isSettlement ? "Settlement" : "Advance"}
                        </td>
                        <td className="p-5 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          {row.createdByAdmin ? "Admin(Self)" : row.userName}
                        </td>
                        <td className="p-5 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          {row.description}
                        </td>
                        <td className="p-5 text-sm font-normal text-gray-900 cursor-pointer dark:text-white">
                          <button
                            onClick={() => handleEditClick(index)}
                            className="text-blue-600 hover:underline"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdvanceHistory;
