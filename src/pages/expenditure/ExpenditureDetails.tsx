/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import moment from "moment";
// import GenericModal from "../../components/Modal"; // Adjust import as per your structure
import Spinner from "../../components/spinner"; // Adjust import as per your structure

interface ExpenditureDetailsProps {
  data: {
    name: string;
    id: number;
    amount: number;
    amountUnit: string;
    spentDate: string | number | Date;
    submitDate: string | number | Date;
    reimbursementType: string;
    description: string;
    status: string;
    imageUrls: string[];
    clientName: string;
    approvedAmount?: number;
    differenceAmount?: number;
    comment?: string;
  };
  onClose: () => void;
}

const ExpenditureDetails = ({ data }: ExpenditureDetailsProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [loadingImages, setLoadingImages] = useState<{
    [key: string]: boolean;
  }>({});
  const [viewerModalOpen, setViewerModalOpen] = useState(false);

  // Initialize loading state for all images
  useEffect(() => {
    const initialLoadingState: { [key: string]: boolean } = {};
    data.imageUrls.forEach((url, index) => {
      console.log("Initializing loading state for image:", url);
      initialLoadingState[index] = true;
    });
    setLoadingImages(initialLoadingState);
  }, [data.imageUrls]);

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setViewerModalOpen(true);
  };

  const closeModal = () => {
    setViewerModalOpen(false);
  };

  const showNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev !== null ? (prev + 1) % data.imageUrls.length : null
    );
  };

  const showPrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev !== null
        ? (prev - 1 + data.imageUrls.length) % data.imageUrls.length
        : null
    );
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!viewerModalOpen) return;

      if (e.key === "ArrowRight") {
        showNextImage();
      } else if (e.key === "ArrowLeft") {
        showPrevImage();
      } else if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [viewerModalOpen]);

  return (
    <div className="mt-4 p-4 dark:bg-gray-900 w-full">
      <h3 className="text-lg font-bold mb-4">Reimbursement Details</h3>

      <div className="mt-4">
        <strong>Images:</strong>
        <div className="flex space-x-2 mt-2 flex-wrap">
          {data.imageUrls.map((url, index) => (
            <div
              key={index}
              className="relative w-32 h-28 rounded overflow-hidden cursor-pointer"
            >
              {/* Spinner overlay while loading */}
              {loadingImages[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                  <Spinner />
                </div>
              )}
              <img
                src={url}
                alt={`receipt-${index}`}
                className={`w-full h-full object-cover rounded hover:scale-105 transition-transform ${
                  loadingImages[index] ? "opacity-0" : "opacity-100"
                }`}
                onClick={() => openImageModal(index)}
                onLoad={() =>
                  setLoadingImages((prev) => ({
                    ...prev,
                    [index]: false,
                  }))
                }
                onError={() =>
                  setLoadingImages((prev) => ({
                    ...prev,
                    [index]: false,
                  }))
                }
              />
            </div>
          ))}
        </div>
        <p className="mt-4">
          <strong>Client Name:</strong> {data.clientName}
        </p>
      </div>

      <div className="mt-4 space-y-2 gap-4">
        {/* <p className="text-lg font-semibold">Submit Details : </p> */}
        <div className="mt-4 sm:grid grid-cols-4 gap-4">
          <p>
            <strong>Type:</strong> {data.reimbursementType}
          </p>
          <p>
            <strong>Amount:</strong> {data.amount} {data.amountUnit}
          </p>
          <p>
            <strong>Spent Date:</strong>{" "}
            {moment(data.spentDate).format("YYYY-MM-DD")}
          </p>
          <p>
            <strong>Submit Date:</strong>{" "}
            {moment(data.submitDate).format("YYYY-MM-DD")}
          </p>
          <p>
            <strong>Status:</strong> {data.status}
          </p>
          <p>
            <strong>Description:</strong> {data.description}
          </p>
        </div>
        {(data.status === "APPROVED" || data.status === "REJECTED") && (
          <div className=" mt-4 space-y-4">
            <h1 className="text-lg font-semibold mt-8 ">Approved Details :</h1>
            <p>
              <strong>Approved Amount:</strong> {data.approvedAmount || "N/A"}
            </p>
            <p>
              <strong>Difference Amount:</strong>{" "}
              {data.differenceAmount || "N/A"}
            </p>
            <p>
              <strong>Comment:</strong> {data.comment || "N/A"}
            </p>
          </div>
        )}
      </div>

      {/* Enhanced Image Viewer Modal */}
      {viewerModalOpen && selectedImageIndex !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative w-full max-w-4xl h-full max-h-[80vh] flex items-center justify-center">
            {/* Close button */}
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-20"
              onClick={closeModal}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Main image */}
            <div className="w-full h-full flex items-center justify-center p-4">
              <img
                src={data.imageUrls[selectedImageIndex]}
                alt="Enlarged view"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Navigation buttons - only show if there are multiple images */}
            {data.imageUrls.length > 1 && (
              <>
                <button
                  className="absolute left-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    showPrevImage();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <button
                  className="absolute right-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                  onClick={(e) => {
                    e.stopPropagation();
                    showNextImage();
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full">
              {selectedImageIndex + 1} / {data.imageUrls.length}
            </div>
          </div>
        </div>
      )}

      {/* We can remove the original GenericModal since we've created a custom one */}
      {/* 
      <GenericModal
        isOpen={selectedImageIndex !== null}
        onClose={closeModal}
        header="Image Viewer"
        customWidth="w-full max-w-screen-lg"
      >
        ...
      </GenericModal>
      */}
    </div>
  );
};

export default ExpenditureDetails;
