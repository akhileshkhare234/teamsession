import React, { useEffect, useState } from "react";
import { SessionData } from "./SessionTypes";
import { motion } from "framer-motion";
import { MenuButton, MenuItems, MenuItem } from "@headlessui/react";
// import { EllipsisVerticalIcon } from "@heroicons/react/solid";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { Menu } from "@headlessui/react";
import Loader from "components/Loader";
import Spinner from "components/spinner";
//import httpClient from "services/network/httpClient";
// import { reverseGeocode } from "utility/geocode";
import { useTranslation } from "react-i18next";

interface SessionDetailsProps {
  data: SessionData;
  isLoading?: boolean;
  onImageDelete?: (imageIds: number[]) => void; // Updated to handle multiple IDs
}

const SessionDetails: React.FC<SessionDetailsProps> = ({ data, isLoading }) => {
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [loadingImages, setLoadingImages] = useState<{
    [key: string]: boolean;
  }>({});
  // const [store, setStore] = useState<string>("Loading...");
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [infoImages, setInfoImages] = useState<
    { id: number; imageLocation: string; description?: string }[]
  >([]);
  // New state for image viewer modal
  const [viewerModalOpen, setViewerModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentTagImages, setCurrentTagImages] = useState<any[]>([]);

  const { t } = useTranslation();

  // console.log(selectedImages);
  // console.log(store);
  useEffect(() => {
    const initialLoadingState: { [key: number]: boolean } = {};
    data?.tags?.forEach((tag) => {
      tag.images?.forEach((img) => {
        initialLoadingState[img.id] = true;
      });
    });
    setLoadingImages(initialLoadingState);
  }, [data]);

  const toggleImageSelection = (id: number) => {
    setSelectedImages((prev) =>
      prev.includes(id)
        ? prev.filter((imageId) => imageId !== id)
        : [...prev, id]
    );
  };

  // New function to open image in modal
  const openImageModal = (tagImages: any[], imageIndex: number) => {
    setCurrentTagImages(tagImages);
    setCurrentImageIndex(imageIndex);
    setViewerModalOpen(true);
  };

  // Navigation functions for image viewer
  const goToNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === currentTagImages.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentTagImages.length - 1 : prev - 1
    );
  };

  // const handleDeleteSelected = () => {
  //   if (selectedImages.length === 0) return;
  //   const payload = {
  //     ids: selectedImages,
  //   };
  //   console.log(payload);
  //   console.log("Selected images", selectedImages);
  //   // console.log("Selected images", payload.ids);

  //   httpClient
  //     .delete(`/services/delete`, {
  //       body: JSON.stringify(payload),
  //     })

  //     .then((response) => {
  //       console.log("Images deleted successfully", response);

  //       setSelectedImages([]);
  //     })
  //     .catch((error) => {
  //       console.error("Failed to delete images", error);
  //     });
  // };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl text-gray-700">No session data available</h2>
          <p className="mt-2 text-gray-500">Please try again later</p>
        </div>
      </div>
    );
  }

  const handleImageInfo = (images: { id: number; imageLocation: string }[]) => {
    setInfoImages(images);
    setInfoModalOpen(true);
  };

  const handleSelectAll = (images: { id: number }[]) => {
    const allIds = images.map((img) => img.id);
    setSelectedImages((prev) => Array.from(new Set([...prev, ...allIds])));
  };

  // const handleDeleteAll = (images: { id: number }[]) => {
  //   const idsToDelete = images.map((img) => img.id);
  //   setSelectedImages(idsToDelete);
  //   handleDeleteSelected(); // reuse your existing delete logic
  // };

  return (
    <div className="flex w-full flex-col h-screen   space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        <div className="flex sm:flex-row flex-col gap-12">
          <div>
            <h2 className="text-base font-semibold mt-4">
              {(data.customerName &&
                data.customerName.charAt(0).toUpperCase() +
                  data.customerName.slice(1)) ||
                "Customer Name"}
            </h2>
          </div>
          <div className="space-y-1 mt-2">
            <p className="text-sm">Login : {data.loginTime}</p>
            <p className="text-sm">Logout : {data.logoutTime}</p>
          </div>
          <div className="space-y-1 max-w-sm w-full">
            <p className="text-sm font-medium">
              {"Login " + t("common.tableHeaders.Location")}:
            </p>
            <p className="text-sm break-words">{data.loginLocation}</p>
          </div>
          <div className="space-y-1 max-w-sm w-full">
            <p className="text-sm font-medium">
              {"Logout " + t("common.tableHeaders.Location")}:
            </p>
            <p className="text-sm break-words">{data.logoutLocation}</p>
          </div>
          {/* <div className="ml-10">
            {selectedImages.length > 0 && (
              <div className="flex justify-end mt-3">
                <button
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
                  onClick={handleDeleteSelected}
                >
                  Delete Selected ({selectedImages.length})
                </button>
              </div>
            )}
          </div> */}
        </div>
      </motion.div>

      {/* Tag & Image Section */}
      <div className="space-y-8">
        {data.tags && data.tags.length > 0 ? (
          data.tags?.map((tag) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-row">
                <h3 className="text-base font-semibold text-gray-800 mb-2 dark:text-white flex items-center justify-between">
                  <span>
                    {tag.tagName &&
                      tag.tagName.charAt(0).toUpperCase() +
                        tag.tagName.slice(1)}
                  </span>
                </h3>
                <Menu
                  as="div"
                  className="relative inline-block left-32  text-left"
                >
                  <MenuButton className="p-1 hover:bg-gray-200 rounded font-semibold">
                    <EllipsisVerticalIcon className="w-5 h-5 font-bold" />
                  </MenuButton>
                  <MenuItems className="absolute right-0 z-10 mt-2  w-48 origin-top-right bg-white dark:bg-gray-600 dark:text-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none">
                    <div className="px-1 py-1 flex flex-row">
                      <MenuItem>
                        {({ active }: { active: boolean }) => (
                          <button
                            className={`${
                              active ? "bg-blue-100" : ""
                            } group flex w-full items-center px-2 py-2 text-sm `}
                            onClick={() => handleSelectAll(tag.images)}
                          >
                            ✅ Select All
                          </button>
                        )}
                      </MenuItem>
                      <MenuItem>
                        {({ active }: { active: boolean }) => (
                          <button
                            className={`${
                              active ? "bg-blue-100" : ""
                            } group flex w-full items-center px-2 py-2 text-sm`}
                            onClick={() => handleImageInfo(tag.images)}
                          >
                            ℹ️ Image Info
                          </button>
                        )}
                      </MenuItem>
                      {/* <MenuItem>
                        {({ active }: { active: boolean }) => (
                          <button
                            className={`${
                              active
                                ? "bg-red-100 text-red-600"
                                : "text-red-600"
                            } group flex w-full items-center px-2 py-2 text-sm`}
                            onClick={() => handleDeleteAll(tag.images)}
                          >
                            🗑️ Delete Images
                          </button>
                        )}
                      </MenuItem> */}
                    </div>
                  </MenuItems>
                </Menu>
              </div>

              <div className="sm:flex overflow-x-auto pb-5 sm:space-x-6 hide-scrollbar">
                {tag.images && tag.images.length > 0 ? (
                  tag.images?.map((image, imageIndex) => {
                    const isSelected = selectedImages.includes(image.id);
                    const isImageLoading = loadingImages[image.id];

                    return (
                      <motion.div
                        key={image.id}
                        className={`relative w-40 h-40 rounded-lg overflow-hidden group border-2 ${
                          isSelected ? "border-blue-500" : "border-transparent"
                        } cursor-pointer`}
                        whileHover={{ scale: 1.05 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openImageModal(tag.images, imageIndex);
                        }}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          toggleImageSelection(image.id);
                        }}
                      >
                        {/* Spinner overlay while loading */}
                        {isImageLoading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
                            <Spinner />
                          </div>
                        )}

                        <img
                          src={image.imageUrl}
                          alt={tag.tagName}
                          className={`w-full h-full object-cover transition-opacity duration-300 ${
                            isImageLoading ? "opacity-0" : "opacity-100"
                          }`}
                          onLoad={() =>
                            setLoadingImages((prev) => ({
                              ...prev,
                              [image.id]: false,
                            }))
                          }
                          onError={() =>
                            setLoadingImages((prev) => ({
                              ...prev,
                              [image.id]: false,
                            }))
                          }
                        />

                        {/* Selection indicator */}
                        {/* <div className="absolute top-2 right-2">
                          <div
                            className={`w-4 h-4 rounded-full border-2 ${
                              isSelected
                                ? "bg-blue-500 border-white"
                                : "border-white"
                            }`}
                          ></div>
                        </div> */}
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-red-400">No Images are </p>
                )}
              </div>
            </motion.div>
          ))
        ) : (
          <p className="text-red-400">No Images </p>
        )}

        {/* Image Info Modal */}
        {infoModalOpen && (
          <div className="fixed inset-0 bg-black  bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-600  rounded-lg shadow-lg w-96 max-w-full p-4 relative">
              <h2 className="text-lg font-semibold mb-4">Image Info</h2>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {infoImages.map((img) => (
                  <div key={img.id} className="border-b pb-1">
                    <p className="text-sm">
                      <span className="text-sm font-semibold">ID:</span>{" "}
                      {img.id}
                    </p>
                    <p className="text-sm ">
                      <span className="text-sm font-semibold"> Location:</span>{" "}
                      {img.imageLocation}
                    </p>
                    <p className="text-sm ">
                      <span className="text-sm font-semibold">Description:</span>{" "}
                      {img.description || "N/A"}
                    </p>
                  </div>
                ))}
              </div>
              <button
                className="absolute top-2 right-2 text-gray-500 dark:text-white hover:text-gray-700 font-semibold"
                onClick={() => setInfoModalOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Image Viewer Modal */}
        {viewerModalOpen && currentTagImages.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
            <div className="relative w-full max-w-4xl h-full max-h-[80vh] flex items-center justify-center">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-300 z-20"
                onClick={() => setViewerModalOpen(false)}
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
                  src={currentTagImages[currentImageIndex].imageUrl}
                  alt="Enlarged view"
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Navigation buttons - only show if there are multiple images */}
              {currentTagImages.length > 1 && (
                <>
                  <button
                    className="absolute left-4 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToPrevImage();
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
                      goToNextImage();
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
                {currentImageIndex + 1} / {currentTagImages.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDetails;
