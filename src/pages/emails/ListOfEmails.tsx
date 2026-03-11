import DataTable from "components/DataTable";
import GenericModal from "components/Modal";
import React, { useEffect } from "react";
import AddEmail from "./AddEmail";
import httpClient from "services/network/httpClient";
import { showToast } from "components/Toaster";
import UpdateEmail from "./UpdateEmail";
import { sortByKey } from "utility/sorting";

type productItem = {
  email: string;
  id: number;
};
const ListOfEmails = () => {
  const [isAdd, setIsAdd] = React.useState(false);
  // const [loading, setLoading] = React.useState(false);
  const [listOfEmails, setListOfEmails] = React.useState<productItem[]>([]);
  const [isupadate, setIsUpdate] = React.useState(false);
  const [updatedData, setUpdatedData] = React.useState<productItem | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [emailToDelete, setEmailToDelete] = React.useState<productItem | null>(null);

  const getEmails = () => {
    setLoading(true);
    httpClient
      .get("/emails")
      .then((response: any) => {
        console.log("Emails fetched successfully:", response.value);
        sortByKey(response.value, "email");
        setListOfEmails(response.value);
      })
      .catch((error) => {
        console.error("Error fetching emails:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getEmails();
    console.log("ListOfEmails component mounted");
    
  }, []);

  const tableData: { header: string; accessor: keyof productItem }[] = [
    { accessor: "email", header: "Report Recipient Email" },
  ];

  const handleDelete = (row: productItem) => {
    setEmailToDelete(row);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!emailToDelete) return;
    
    httpClient
      .delete(`/emails/delete/${emailToDelete.id}`)
      .then((response: any) => {
        console.log("Email deleted successfully:", response);
        if (response.success) {
          showToast("Email deleted successfully", "success");
          getEmails(); // Refresh the email list after deletion
        } else {
          showToast(response.error.message, "error");
        }
      })
      .catch((error) => {
        console.error("Error deleting email:", error);
        showToast("Failed to delete email", "error");
      })
      .finally(() => {
        setShowDeleteConfirm(false);
        setEmailToDelete(null);
      });
  };
  const handleEdit = (row: productItem) => {
    // Implement edit functionality here
    console.log("Edit email:", row);
    setIsUpdate(true);
    setUpdatedData(row);
  };

  return (
    <div>
      <DataTable<productItem>
        columns={tableData}
        data={listOfEmails}
        theadHeight="h-[calc(100vh-205px)]"
        actions={["delete", "edit"]}
        onDelete={handleDelete}
        onEdit={handleEdit}
        isSearch={true}
        isAdding={true}
        onAddBtnClick={() => setIsAdd(true)}
        isExport={true}
        loading={loading}
      ></DataTable>

      {isAdd && (
        <GenericModal
          isOpen={isAdd}
          onClose={() => setIsAdd(false)}
          header="Add Email"
        >
          <AddEmail onClose={() => setIsAdd(false)} onSuccess={getEmails} />
        </GenericModal>
      )}
      {/* Add your email list rendering logic here */}
      {isupadate && (
        <GenericModal
          isOpen={isupadate}
          onClose={() => setIsUpdate(false)}
          header="Update Email"
        >
          <UpdateEmail
            updateEmail={updatedData}
            onClose={() => setIsUpdate(false)}
            onSuccess={getEmails}
          ></UpdateEmail>
        </GenericModal>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && emailToDelete && (
        <GenericModal
          isOpen={showDeleteConfirm}
          onClose={() => {
            setShowDeleteConfirm(false);
            setEmailToDelete(null);
          }}
          header="Confirm Delete"
        >
          <div className="p-4 flex flex-col gap-4">
            <p>Are you sure you want to delete this email: <strong>{emailToDelete.email}</strong>?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setEmailToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </GenericModal>
      )}
    </div>
  );
};

export default ListOfEmails;
