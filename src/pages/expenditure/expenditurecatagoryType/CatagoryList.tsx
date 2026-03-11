import React, { useEffect, useState } from "react";
import httpClient from "services/network/httpClient";
import TableData from "components/DataTable";
import GenericModal from "components/Modal";
import AddCatagory from "./AddCatagory";
import Loader from "components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faEdit } from "@fortawesome/free-solid-svg-icons";
import { showToast } from "components/Toaster";
import UpdateCategory from "./UpdateCategory";
interface EditCategory {
  id: string;
  name: string;
  detailedReport?: boolean;
}
const CatagoryList = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [isUpdatingData, setIsUpdatingData] = useState(false);
  const [editCategory, setEditCategory] = useState<EditCategory | undefined>();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const getCategories = () => {
    setLoading(true);
    httpClient
      .get("reimbursements/alltypes")
      .then((res: any) => {
        console.log("Expenditure categories response", res.value);
        // Ensure each category has detailedReport property
        const formattedCategories = res.value.map((cat: any) => ({
          ...cat,
          detailedReport: cat.detailedReport || false,
        }));
        // Sort categories by name (case-insensitive)
        formattedCategories.sort((a: any, b: any) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
        );
        setCategories(formattedCategories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Handle toggling detailed report for a single category
  const handleToggleDetailed = (category: any) => {
    const payload = [{
      id: category.id,
      detailedReport: !category.detailedReport, // Toggle the value
    }];

    setUpdating(true);
    httpClient
      .put("reimbursement-types/mark-detailed", payload)
      .then((response: any) => {
        if (response.success) {
          showToast(
            `Category "${category.name}" ${!category.detailedReport ? "enabled" : "disabled"} for detailed report`,
            "success"
          );
          // Instead of calling getCategories immediately, update local state for instant UI feedback
          setCategories((prev) =>
            prev.map((cat) =>
              cat.id === category.id
                ? { ...cat, detailedReport: !category.detailedReport }
                : cat
            )
          );
        } else {
          showToast("Failed to update category", "error");
        }
      })
      .catch((error) => {
        console.error("Error updating category:", error);
        showToast("Error updating category", "error");
      })
      .finally(() => {
        setUpdating(false);
      });
  };

  // Checkbox selection handlers
  const handleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === categories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categories.map((cat) => cat.id));
    }
  };

  // Bulk disable handler
  const handleBulkDisable = () => {
    if (selectedIds.length === 0) return;
    
    // Only get IDs of categories that are currently enabled
    const categoriesToDisable = selectedIds.filter(id => {
      const category = categories.find(cat => cat.id === id);
      return category && category.detailedReport;
    });
    
    if (categoriesToDisable.length === 0) {
      showToast("All selected categories are already disabled", "info");
      setIsDisabled(false);
      return;
    }
    
    const payload = categoriesToDisable.map((id) => ({
      id,
      detailedReport: false,
    }));
    
    setUpdating(true);
    httpClient
      .put("reimbursement-types/mark-detailed", payload)
      .then((response: any) => {
        if (response.success) {
          showToast(
            `${categoriesToDisable.length} categor${categoriesToDisable.length === 1 ? "y" : "ies"} disabled for detailed report`,
            "success"
          );
          setCategories((prev) =>
            prev.map((cat) =>
              categoriesToDisable.includes(cat.id)
                ? { ...cat, detailedReport: false }
                : cat
            )
          );
          setSelectedIds([]);
        } else {
          showToast("Failed to update categories", "error");
        }
      })
      .catch(() => {
        showToast("Error updating categories", "error");
      })
      .finally(() => {
        setIsDisabled(false);
        setUpdating(false);
      });
  };

  // Custom row renderer for the table to add toggle button and checkbox
  const renderCustomRow = (row: any, columns: any[]) => (
    <tr
      key={row.id}
      className={`hover:bg-gray-200 dark:hover:bg-[#444444]`}
    >
      <td className="p-3 sm:p-5 text-xs sm:text-sm font-normal text-gray-900 dark:text-white">
        <input
          type="checkbox"
          checked={selectedIds.includes(row.id)}
          onChange={() => handleSelectRow(row.id)}
          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
        />
      </td>
      {columns.map((col, colIndex) => (
        <td
          key={colIndex}
          className="p-3 sm:p-5 text-xs sm:text-sm font-normal text-gray-900 dark:text-white truncate max-w-[180px] sm:max-w-xs"
        >
          {row[col.accessor]}
        </td>
      ))}
      <td className="p-3 sm:p-5 text-xs sm:text-sm font-normal text-gray-900 dark:text-white">
        {/* Toggle Button */}
        <button
          onClick={() => handleToggleDetailed(row)}
          className={`relative inline-flex items-center h-6 rounded-full w-12 transition-colors duration-200 focus:outline-none ${
            row.detailedReport ? "bg-green-500" : "bg-gray-300"
          }`}
          disabled={updating}
          aria-pressed={row.detailedReport}
          aria-label="Toggle detailed report"
        >
          <span
            className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-200 ${
              row.detailedReport ? "translate-x-6" : "translate-x-1"
            }`}
          />
          <span className="sr-only">
            {row.detailedReport ? "Enabled" : "Disabled"}
          </span>
        </button>
        <span className="ml-3 text-xs font-medium">
          {row.detailedReport ? "Enabled" : "Disabled"}
        </span>
      </td>
      {/* Actions column */}
      <td className="p-3 sm:p-5 text-xs sm:text-sm font-normal text-gray-900 dark:text-white">
        <div className="flex items-center gap-5">
          <button onClick={() => handleEdit(row)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      </td>
    </tr>
  );

  // Custom header renderer to add actions header, select all checkbox, and bulk disable button
  const renderCustomHeader = (columns: any[]) => (
    <>
      <tr>
        <th className="p-3 sm:p-5 text-left text-xs sm:text-sm font-medium text-gray-800 capitalize dark:text-white whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedIds.length === categories.length && categories.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600"
            />
            <span>All</span>
          </div>
        </th>
        {columns.map((col, index) => (
          <th
            key={index}
            className="p-3 sm:p-5 text-left text-xs sm:text-sm font-medium text-gray-800 capitalize dark:text-white whitespace-nowrap"
          >
            {col.header}
          </th>
        ))}
        <th className="p-3 sm:p-5 text-left text-xs sm:text-sm font-medium text-gray-800 capitalize dark:text-white whitespace-nowrap">
          <div className="flex items-center justify-between">
            {/* <span>Status</span> */}
            <div className="flex gap-2">
              <button
                type="button"
                className={`px-3 py-1.5 bg-green-500 text-white rounded hover:bg-green-600 text-xs flex items-center gap-1 ${
                  selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={selectedIds.length === 0}
                onClick={() => setIsEnabled(true)}
              >
                Enable
                {selectedIds.length > 0 ? (
                  <span className="ml-1 font-bold">({
                    selectedIds.filter(id => {
                      const category = categories.find(cat => cat.id === id);
                      return category && !category.detailedReport;
                    }).length
                  })</span>
                ) : <span className="ml-1 font-bold invisible">(0)</span>}
              </button>
              <button
                type="button"
                className={`px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-xs flex items-center gap-1 ${
                  selectedIds.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={selectedIds.length === 0}
                onClick={() => setIsDisabled(true)}
              >
                Disable
                {selectedIds.length > 0 ? (
                  <span className="ml-1 font-bold">({
                    selectedIds.filter(id => {
                      const category = categories.find(cat => cat.id === id);
                      return category && category.detailedReport;
                    }).length
                  })</span>
                ) : <span className="ml-1 font-bold invisible">(0)</span>}
              </button>
            </div>
          </div>
        </th>
        <th className="p-3 sm:p-5 text-left text-xs sm:text-sm font-medium text-gray-800 capitalize dark:text-white whitespace-nowrap">
          Actions
        </th>
      </tr>
      {/* Add border between header and content */}
      <tr>
        <td colSpan={columns.length + 3}>
          <div className="border-b border-gray-300 dark:border-gray-600 w-full"></div>
        </td>
      </tr>
    </>
  );

  // Enhanced columns definition
  const columns = [
    {
      accessor: "name",
      header: "Name",
    },
  ];
const handleEdit = (row: any) => {
    setIsUpdatingData(true);
    console.log("Editing category:", row);
    setEditCategory(row); // Set the selected category for editing
  }
  return (
    <div className="flex flex-col h-full p-4">
      {loading ? (
        <Loader />
      ) : (
        <TableData
          data={categories}
          columns={columns}
          theadHeight="h-[calc(100vh-205px)]"
          isSearch={true}
          isAdding={true}
          onAddBtnClick={() => setIsAdding(true)}
          isExport={true}
          customRowRenderer={renderCustomRow}
          customHeaderRenderer={renderCustomHeader}
          itemsPerPages={10}
          actions={["edit"]}
          onEdit={handleEdit}
        />
      )}

      {isAdding && (
        <GenericModal
          isOpen={isAdding}
          onClose={() => setIsAdding(false)}
          header="Add Category"
        >
          <AddCatagory
            getData={getCategories}
            onClose={() => setIsAdding(false)}
          />
        </GenericModal>
      )}
      {
        isUpdatingData && editCategory && (
          <GenericModal
            isOpen={isUpdatingData}
            onClose={() => setIsUpdatingData(false)}
            header="Update Category"
          >
            <UpdateCategory
              getData={getCategories}
              onClose={() => setIsUpdatingData(false)} 
              updateData={editCategory} // Pass the selected category for editing
            />
          </GenericModal>
        )}

        {
          isEnabled && (
            <GenericModal
              isOpen={isEnabled}
              onClose={() => setIsEnabled(false)}
              header="Enable Category"
            >
              <div className="p-4">
                <p>
                  {(() => {
                    const categoriesToEnable = selectedIds.filter(id => {
                      const category = categories.find(cat => cat.id === id);
                      return category && !category.detailedReport;
                    });
                    return `Are you sure you want to enable ${categoriesToEnable.length} categor${categoriesToEnable.length === 1 ? 'y' : 'ies'} for detailed report?`;
                  })()}
                </p>
              </div>
              <div className="flex justify-end space-x-4">
                 <button
                   onClick={() => {
                // Enable selected
                if (selectedIds.length === 0) return;
                // Only get IDs of categories that are currently disabled
                const categoriesToEnable = selectedIds.filter(id => {
                  const category = categories.find(cat => cat.id === id);
                  return category && !category.detailedReport;
                });
                
                if (categoriesToEnable.length === 0) {
                  showToast("All selected categories are already enabled", "info");
                  setIsEnabled(false);
                  return;
                }
                
                const payload = categoriesToEnable.map((id) => ({
                  id,
                  detailedReport: true,
                }));
                
                setUpdating(true);
                httpClient
                  .put("reimbursement-types/mark-detailed", payload)
                  .then((response: any) => {
                    if (response.success) {
                      showToast(
                        `${categoriesToEnable.length} categor${categoriesToEnable.length === 1 ? "y" : "ies"} enabled for detailed report`,
                        "success"
                      );
                      setCategories((prev) =>
                        prev.map((cat) =>
                          categoriesToEnable.includes(cat.id)
                            ? { ...cat, detailedReport: true }
                            : cat
                        )
                      );
                      setSelectedIds([]);
                    } else {
                      showToast("Failed to update categories", "error");
                    }
                  })
                  .catch(() => {
                    showToast("Error updating categories", "error");
                  })
                  .finally(() => {
                    setIsEnabled(false);
                    setUpdating(false);
                  });

              }}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Sure
                </button>
                <button
                  onClick={() => setIsEnabled(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  No
                </button>
               
              </div>
            </GenericModal>
          )
        }
        {
          isDisabled && (
            <GenericModal
              isOpen={isDisabled}
              onClose={() => setIsDisabled(false)}
              header="Disable Category"
            >
              <div className="p-4">
                <p>
                  {(() => {
                    const categoriesToDisable = selectedIds.filter(id => {
                      const category = categories.find(cat => cat.id === id);
                      return category && category.detailedReport;
                    });
                    return `Are you sure you want to disable ${categoriesToDisable.length} categor${categoriesToDisable.length === 1 ? 'y' : 'ies'} for detailed report?`;
                  })()}
                </p>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleBulkDisable}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Sure
                </button>
                <button
                  onClick={() => setIsDisabled(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  No
                </button>
                
              </div>
            </GenericModal>
          )
        }
      
    </div>
  );
};

export default CatagoryList;

