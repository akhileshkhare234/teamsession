/* eslint-disable react-hooks/exhaustive-deps */
import { motion } from "framer-motion";
import DataTable from "components/DataTable";
import React, { useEffect, useRef, useState } from "react";
// import httpClient from "services/network/httpClient";
import NoData from "assets/No-Data.jpg";
import httpClient from "services/network/httpClient";
import Loader from "components/Loader";
import GenericModal from "components/Modal";
import SessionDetails from "../Task/sessionLlist/SessionModal";
import { date, time } from "utility/dateconversion";
import { sortByKeys } from "utility/sorting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SessionFilter from "components/filter/SessionFilter";
import { faFilter, faTimes,faXmark } from "@fortawesome/free-solid-svg-icons";

interface ImageProps {
  id: number;
  imageUrl: string;
  latitude: string;
  longitude: string;
  imageLocation: string;
}

interface TagProps {
  id: number;
  tagName: string;
  images: ImageProps[];
}

interface SessionProps {
  id: number;
  customerName: string;
  loginTime: string;
  loginLat: string;
  loginLong: string;
  logoutTime: string;
  logoutLat: string;
  logoutLong: string;
  status: number;
  tags: TagProps[];
  logoutDate: string;
  loginDate: string;
  loginLocation: string;
  logoutLocation: string;
}

// interface SessionData {
//   data: SessionProps;
// }

interface ColumnProps {
  header: string;
  accessor: keyof SessionProps;
}

const tableColumn: ColumnProps[] = [
  {
    accessor: "customerName",
    header: "Customer Name",
  },
  {
    accessor: "loginDate",
    header: "Login Date",
  },
  {
    accessor: "loginTime",
    header: "Login Time",
  },
  {
    accessor: "logoutDate",
    header: "Logout Date",
  },
  {
    accessor: "logoutTime",
    header: "Logout Time ",
  },
  {
    accessor: "status",
    header: "Status",
  },
];

interface SessionAllProps {
  data: any; // Assuming data is a userId or similar identifier
  filterParams?: any;
}

const SessionAll = ({ data, filterParams }: SessionAllProps) => {
  const [sessionStorage, setSessionStorage] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const [viewData, setViewData] = useState<SessionProps>();
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
 const [filterCount, setFilterCount] = useState<number>(0);
 console.log(filterCount);
  const [currentFilters, setCurrentFilters] = useState<any>({});
 console.log(currentFilters); 
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  console.log(sessionStorage);
  console.log(data);
  const userId = data; // Use userId if available, otherwise use data directly
  console.log("filterParams", filterParams);
  
  const queryParams = new URLSearchParams(filterParams).toString();
  console.log("Query Params:", queryParams);


  const fetchSessions = (url: string) => {
    try {
      setIsLoading(true);
      httpClient
        .get(url)
        .then((response: any) => {
          console.log(response);
          // sortByKey(response.value, "customerName");
          const storeTime = response.value.map((session: SessionProps) => {
            const loginDateTime = session.loginTime
              ? new Date(session.loginTime)
              : null;
            // const logoutDateTime = session.logoutTime
            //   ? new Date(session.logoutTime)
            //   : null;

            return {
              ...session,
              loginDate: session.loginTime ? date(session.loginTime) : "--",
              loginTime: session.loginTime ? time(session.loginTime) : "--",
              logoutDate: session.logoutTime ? date(session.logoutTime) : "--",
              logoutTime: session.logoutTime ? time(session.logoutTime) : "--",
              status: session.status === 1 ? "Completed" : "Pending",
              loginTimestamp: loginDateTime ? loginDateTime.getTime() : 0,
            };
          });

          const timestoreddata = sortByKeys(storeTime);
          // sortByKeys(timestoreddata);
          // const store = sortByKey(timestoreddata, "customerName");
          // console.log("Session response", store);
          setSessionStorage(timestoreddata);
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    console.log("Fetching sessions for userId:", filterParams);
    const hasFilters = filterParams && Object.keys(filterParams).length > 0;
    const currentMonth = new Date().getMonth() + 1; // Months are 0-indexed in JavaScript
    const currentYear = new Date().getFullYear();


    if (hasFilters) {
      const queryParams = new URLSearchParams(filterParams).toString();
      fetchSessions(`services/user/${data.userId}?${queryParams}`);
    } else {
      fetchSessions(`services/user/${data.userId}?month=${currentMonth}&year=${currentYear}`);
    }
  }, [data, filterParams]);

  const handleView = (row: any) => {
    console.log(row);
    setIsView(true);
    setViewData(row);
  };

  const submit = (data: any) => {
    const url = new URLSearchParams();
   const appliedFiltersCount = Object.values(data).filter(Boolean).length;
    if (data.fromDate) {
      const fromDateConcat = data.fromDate + "T00:00:00Z";
      url.append("fromDate", fromDateConcat);
    }
    if (data.toDate) {
      const toDateConcat = data.toDate + "T23:59:59Z";
      url.append("toDate", toDateConcat);
    }
    if (data.month) {
      url.append("month", data.month);
    }
    if (data.year) {
      url.append("year", data.year);
    }
    if (data.status) {
      url.append("status", data.status);
    }
    // Removed userId parameter since we're already filtering for a specific employee
    // Set filter indicator state
    setHasActiveFilters(appliedFiltersCount > 0);
    setFilterCount(appliedFiltersCount);
      setCurrentFilters(data);

    console.log("Filter URL parameters:", url);
    console.log("Filter URL parameters:", url.toString());
    console.log("Filter data submitted:", data);
    setIsLoading(true); // Show loader while fetching
    httpClient
      .get(`services/user/${userId.userId}?${url.toString()}`)
      .then((response: any) => {
        console.log("Dashboard stats response:", response);

        if (response.success) {
          // Check if response.value is empty
          if (!response.value || response.value.length === 0) {
            setSessionStorage([]); // Set to empty array to trigger "No sessions available"
          } else {
            const storeTime = response.value.map((session: SessionProps) => {
              const loginDateTime = session.loginTime
                ? new Date(session.loginTime)
                : null;

              return {
                ...session,
                loginDate: session.loginTime ? date(session.loginTime) : "--",
                loginTime: session.loginTime ? time(session.loginTime) : "--",
                logoutDate: session.logoutTime ? date(session.logoutTime) : "--",
                logoutTime: session.logoutTime ? time(session.logoutTime) : "--",
                status: session.status === 1 ? "Completed" : "Pending",
                loginTimestamp: loginDateTime ? loginDateTime.getTime() : 0,
              };
            });

            setSessionStorage(sortByKeys(storeTime));
          }
          setIsFilterOpen(false); // Close filter dropdown after submission
        }
      })
      .catch((error) => {
        console.error("Error fetching filtered sessions:", error);
        setSessionStorage([]); // Show "No sessions available" on error
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

 const clearFilters = () => {
  setHasActiveFilters(false);
  setFilterCount(0);
  setCurrentFilters({});
  setIsFilterOpen(false);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  fetchSessions(
    `services/user/${data.userId}?month=${currentMonth}&year=${currentYear}`
  );
};

  return (
    <div className="h-[calc(90vh-100px)] relative  rounded-xl">
      
      <div className="flex w-full items-center justify-between space-x-2 dark:text-white  rounded-lg ">
        <div className="flex-1">
          <div className="flex flex-row justify-between space-x-4 ">
            <div className="flex space-x-4">
              <div className="flex flex-col justify-center text-center">
                <h2 className="text-base font-semibold ">
                  {data?.employeeName}
                </h2>
                <p className="text-gray-600 text-sm dark:text-white">
                  City: {data?.city}
                </p>
              </div>
              <div className="text-center mt-2 px-2">
                <p className="text-xl font-semibold text-green-600">
                  {data?.completedServices}
                </p>
                <p className="text-sm text-gray-500 dark:text-white">
                  Completed
                </p>
              </div>
              <div className="text-center mt-2 px-2">
                <p className="text-xl font-semibold text-orange-600">
                  {data?.pendingServices}
                </p>
                <p className="text-sm text-gray-500 dark:text-white">Pending</p>
              </div>
            </div>

            <div className="ml-auto">
              <div className="flex justify-end items-center space-x-4 py-4">
                {" "}
                {/* Changed from left-[620px] to right-8 for better responsive placement */}
                <button
                    ref={filterButtonRef}
                    type="button"
                     onClick={() => setIsFilterOpen(!isFilterOpen)}
                     className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all
                     ${
                     hasActiveFilters
                       ? " bg-blue-100 dark:bg-[#1E3A8A] border-blue-400 dark:border-blue-500 text-black dark:text-white"
                        : "bg-white border-gray-300 text-black dark:bg-gray-700 dark:text-white"
                           }
                            `}>
  <FontAwesomeIcon
    icon={faFilter}
    className={`${hasActiveFilters ? "text-black dark:text-white" : ""}`}
  />
  <span className="text-black dark:text-white">Filter</span>

  {/* Green dot */}
  {hasActiveFilters && (
     <span className="absolute top-1 left-6 h-2 w-2 bg-green-500 rounded-full" />
  )}

  {/* Count badge */}
  {filterCount > 0 && (
    <span className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
      {filterCount}
    </span>
  )}
</button>

                {/* Filter Dropdown Panel */}
                {isFilterOpen && (
                  <div
                    ref={filterRef}
                    className="absolute top-16 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 w-[340px] sm:w-[400px] transition-all duration-200"
                    style={{
                      opacity: isFilterOpen ? 1 : 0,
                      transform: isFilterOpen
                        ? "translateY(0)"
                        : "translateY(-10px)",
                    }}
                  >
                    <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-800 dark:text-white">
                        Filter Sessions
                      </h3>
                       {hasActiveFilters && (
                                            <button
                                              onClick={clearFilters}
                                              className="ml-auto mr-3 text-xs bg-blue-500 text-white px-2 py-0.5 rounded flex items-center"
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
                    <div className="p-4">
                      <SessionFilter
                        submit={submit}
                        hideUserField={true} // Add this prop to hide the user field
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <div className="h-full w-full flex items-center justify-center">
          <Loader />
        </div>
      ) : sessionStorage && sessionStorage.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DataTable
            columns={tableColumn}
            data={sessionStorage}
            // theadHeight="max-h-[250px]"
            theadHeight="h-[calc(85vh-200px)]"
            actions={["view"]}
            onView={handleView}
            onRowClick={handleView}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="h-full flex flex-col items-center justify-center space-y-4"
        >
          <img
            src={NoData}
            alt="No Data found"
            className="w-48 h-48 rounded-full shadow-lg object-cover"
          />
          <p className="text-gray-600 font-medium">No sessions available</p>
        </motion.div>
      )}
      {isView && (
        <GenericModal
          isOpen={isView}
          onClose={() => setIsView(false)}
          header="Session List"
          // customHeight="calc(100vh - 50px)"
          // customWidth="80vw"
          size="full"
        >
          {viewData && <SessionDetails data={viewData} />}
        </GenericModal>
      )}
    </div>
  );
};
export default SessionAll;
