/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import httpClient from "../../services/network/httpClient";
import Loader from "components/Loader";
import SessionDetails from "pages/dashboard/Task/sessionLlist/SessionModal";
import GenericModal from "components/Modal";
import ProfileImage from "assets/avatar.png";
import DataTable from "components/DataTable";
import { date, time } from "utility/dateconversion";

import { useTranslation } from "react-i18next";
import { sortByKeys } from "utility/sorting";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter, faTimes,faXmark } from "@fortawesome/free-solid-svg-icons";
import SessionFilter from "components/filter/SessionFilter";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import ArrowRightIcon from "@heroicons/react/24/outline/ArrowRightIcon";
import PillButton from "components/button/Pills";

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
  logoutDate: string;
  loginDate: string;
  address: string;
  loginLocation: string;
  logoutLocation: string;
}

interface EmployeeDetailProps {
  data: any;
  allEmployees: any[];
  currentIndex: number;
  onNavigate: (newIndex: number) => void;
  onBack: () => void;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
  data,
  allEmployees,
  currentIndex,
  onNavigate,
  onBack,
}) => {
  const [sessions, setSessions] = useState<SessionProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isView, setIsView] = useState(false);
  const [viewData, setViewData] = useState<any>();
  const [completedSession, setCompletedSession] = useState(0);
  const [toDaySession, setTodaySession] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
const [filterCount, setFilterCount] = useState<number>(0);

const [currentFilters, setCurrentFilters] = useState<any>({});
console.log(filterCount);
console.log(currentFilters);
  const userId = data?.id;
  const today = new Date();
  console.log(toDaySession);
  const { t } = useTranslation();

  // Add a useEffect to prevent sidebar collapse when component mounts
  // useEffect(() => {
  //   // Get the sidebar element - adjust the selector to match your actual sidebar
  //   const sidebar = document.querySelector(".sidebar") as HTMLElement;

  //   if (sidebar) {
  //     // Save the current state of the sidebar
  //     const originalWidth = sidebar.style.width;
  //     const originalClasses = sidebar.className;

  //     // Force the sidebar to remain expanded
  //     sidebar.style.width = sidebar.dataset.expandedWidth || "250px";
  //     sidebar.classList.remove("collapsed", "minimized");
  //     sidebar.classList.add("expanded");

  //     // Restore the original state when the component unmounts
  //     return () => {
  //       sidebar.style.width = originalWidth;
  //       sidebar.className = originalClasses;
  //     };
  //   }
  // }, []);

  useEffect(() => {
    if (data?.id) {
      setIsLoading(true);
      httpClient
        .get(`services/user/${data.id}`)
        .then((response: any) => {
          const formattedSessions = response.value.map(
            (session: SessionProps) => {
              const loginDateTime = session.loginTime
                ? new Date(session.loginTime)
                : null;

              return {
                ...session,
                loginDate: session.loginTime ? date(session.loginTime) : "--",
                loginTime: session.loginTime ? time(session.loginTime) : "--",
                logoutDate: session.logoutTime
                  ? date(session.logoutTime)
                  : "--",
                logoutTime: session.logoutTime
                  ? time(session.logoutTime)
                  : "--",
                status: session.status === 1 ? "Completed" : "Pending",
                loginTimestamp: loginDateTime ? loginDateTime.getTime() : 0,
              };
            }
          );

          const sortedSessions = sortByKeys(formattedSessions);
          setSessions(sortedSessions);

          const completed = sortedSessions.filter(
            (session: any) => session.status === "Completed"
          );
          console.log("completed", completed);
          setCompletedSession(completed.length);

          const todayDate = today.toISOString().split("T")[0];
          const todaySessions = sortedSessions.filter((session: any) => {
            const sessionDate = session.loginDate;
            return sessionDate === todayDate && session.status === "Completed";
          });
          setTodaySession(todaySessions.length);
        })
        .catch((error) => console.error(error))
        .finally(() => setIsLoading(false));
    }
  }, [data]);

  console.log("sessions", sessions);
  const day = sessions.filter((session: SessionProps) => {
    const todayDate = today.toISOString().split("T")[0];
    return session.loginDate === todayDate;
  });
  console.log("day", day.length);

  const tableData: { header: string; accessor: keyof SessionProps }[] = [
    { accessor: "customerName", header: "Customer Name" },
    { accessor: "loginDate", header: "Login Date" },
    { accessor: "loginTime", header: "Login Time" },
    { accessor: "logoutDate", header: "Logout Date" },
    { accessor: "logoutTime", header: "Logout Time" },
    { accessor: "status", header: "Status" },
  ];

  const handlePrevious = () => {
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < allEmployees.length - 1) onNavigate(currentIndex + 1);
  };

  const getStats = () => {
    const completed = completedSession;
    const total = sessions.length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const stats = getStats();

  const onRowClick = (rowData: any) => {
    setIsView(true);
    setViewData(rowData);
  };
  const submit = (data: any) => {
     let activeFilters = 0;
    const url = new URLSearchParams();
     const newFilters: any = {};
    if (data.fromDate) {
      const fromDateConcat = data.fromDate + "T00:00:00Z";
      url.append("fromDate", fromDateConcat);
      newFilters.fromDate = data.fromDate;
    activeFilters++;
    }
    if (data.toDate) {
      const toDateConcat = data.toDate + "T23:59:59Z";
      url.append("toDate", toDateConcat);
      newFilters.fromDate = data.fromDate;
    activeFilters++;
    }
    if (data.month) {
      url.append("month", data.month);
      newFilters.fromDate = data.fromDate;
    activeFilters++;
    }
    if (data.year) {
      url.append("year", data.year);
      newFilters.fromDate = data.fromDate;
    activeFilters++;
    }
    if (data.status) {
      url.append("status", data.status);
      newFilters.fromDate = data.fromDate;
    activeFilters++;
    }
setHasActiveFilters(activeFilters > 0);
  setFilterCount(activeFilters);
  setCurrentFilters(newFilters);
    console.log("Filter URL parameters:", url);
    console.log("Filter URL parameters:", url.toString());
    console.log("Filter data submitted:", data);
    httpClient
      .get(`services/user/${userId}?${url.toString()}`)
      .then((response: any) => {
        console.log("Dashboard stats response:", response);

        if (response.success) {
          console.log("Total counts:", response.value.totalCounts);
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

          setSessions(sortByKeys(storeTime));
          const completed = storeTime.filter(
            (session: any) => session.status === "Completed"
          );
          console.log("completed", completed);
          setCompletedSession(completed.length);

          setIsFilterOpen(false); // Close filter dropdown after submission
        }
      })
      .catch((error) => {
        console.error("Error fetching filtered sessions:", error);
        // Handle error appropriately
      });
  };

  const clearFilters = () => {
  setHasActiveFilters(false);
  setFilterCount(0);
  setCurrentFilters({});
  setIsFilterOpen(false);

  // Fetch default sessions (no filters)
  setIsLoading(true);
  httpClient
    .get(`services/user/${userId}`)
    .then((response: any) => {
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

      setSessions(sortByKeys(storeTime));
      const completed = storeTime.filter(
        (session: any) => session.status === "Completed"
      );
      setCompletedSession(completed.length);
      setTodaySession(
        storeTime.filter(
          (session: any) =>
            session.loginDate === today.toISOString().split("T")[0] &&
            session.status === "Completed"
        ).length
      );
    })
    .catch((error) => console.error(error))
    .finally(() => setIsLoading(false));
};


  return isLoading ? (
    <Loader />
  ) : (
    <div className="flex flex-col h-screen mt-3 min-w-0 max-w-full overflow-x-hidden">
      <div className="flex justify-between mb-2 flex-wrap">
        <PillButton variant="basic" onClick={onBack} className="w-auto">
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          <span className="text-sm font-medium">Back</span>
        </PillButton>

        <div className="flex flex-row space-x-4 mr-2">
          <PillButton
            variant="basic"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="w-auto"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium ">Previous Employee</span>
          </PillButton>

          <PillButton
            variant="basic"
            onClick={handleNext}
            disabled={currentIndex === allEmployees.length - 1}
            className="w-auto"
          >
            <span className="text-sm font-medium">Next Employee</span>
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </PillButton>
        </div>
        <div className="relative invisible">
          <p>Hi</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row rounded-xl p-2 space-x-10">
        <div className="flex items-center space-x-6 w-[470px] h-[175px] p-6 bg-[#FCFCFC] dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg">
          <img
            src={data.url || ProfileImage}
            alt="Profile"
            className="w-32 h-40 p-2 rounded-lg border bg-white border-gray-300 object-cover"
          />
          <div className="text-black dark:text-white w-[250px] h-40 space-y-1 p-2 font-inter font-normal text-14">
            <h2
              className="truncate whitespace-nowrap font-inter font-medium text-16  overflow-hidden"
              title={`${data.firstName} ${data.lastName}`}
            >
              {data.firstName} {data.lastName}
            </h2>
            <div className=" flex flex-col  font-inter font-normal text-14">
              <p
                className="truncate font-inter font-normal text-14"
                title={data.employeeCode}
              >
                {data.employeeCode}
              </p>
              <p
                className="truncate font-inter font-normal text-14 "
                title={data.designation}
              >
                {data.designation}
              </p>
              <p
                className="truncate font-inter font-normal text-14"
                title={data.address}
                // style={{
                //   fontFamily: "Inter",
                //   fontWeight: 400,
                //   fontStyle: "normal",
                //   fontSize: "14px",
                //   letterSpacing: "0px",
                //   lineHeight: "18px",
                // }}
              >
                {data.address}
              </p>
              <p
                className="truncate font-inter font-medium  text-14 letter-spacing-0 line-height-100"
                title={data.city}
              >
                {data.city}
              </p>
              <p
                className="truncate font-inter font-medium  text-14 letter-spacing-0 line-height-100"
                title={data.email}
                // style={{
                //   fontFamily: "Inter",
                //   fontWeight: 400,
                //   fontStyle: "normal",
                //   fontSize: "14px",
                //   letterSpacing: "0px",
                //   lineHeight: "18px",
                // }}
              >
                {data.email}
              </p>

              <p
                className="truncate font-inter font-medium  text-14 letter-spacing-0 line-height-100"
                title={data.mobile}
              >
                {data.mobile}
              </p>
            </div>
          </div>
        </div>
        <section className="flex flex-col space-y-5">
          <div className="flex flex-col  justify-center items-center w-[253px] h-[75px]  bg-[#FCFCFC] dark:bg-gray-700 border-b-4 border-[#08B391] rounded-lg">
            <p className="font-inter font-medium  text-16 letter-spacing-0 line-height-100 ">
              {t("common.tableHeaders.Total")} Sessions:{" "}
              <span className="font-inter font-medium  text-16 letter-spacing-0 line-height-100 ">
                {stats.total}
              </span>
            </p>
            <div className="flex flex-row gap-5 mt-2">
              <p className="text-green-600 border-r-2 border-gray-300 pr-3 font-inter font-medium  text-16 letter-spacing-0 line-height-100 ">
                {t("common.tableHeaders.completed")}:{" "}
                <span className="font-inter font-medium  text-16 letter-spacing-0 line-height-100 ">
                  {stats.completed}
                </span>
              </p>
              <p className="text-orange-600 font-inter font-medium  text-16 letter-spacing-0 line-height-100 ">
                {" "}
                {t("common.tableHeaders.pending")}:{" "}
                <span className="font-inter font-medium  text-16 letter-spacing-0 line-height-100 ">
                  {stats.pending}
                </span>
              </p>
            </div>
          </div>
          <div className="flex flex-col dark:bg-gray-700 justify-center items-center w-[253px] h-[75px]  bg-[#FCFCFC] border-b-4 border-[#08B391] rounded-lg">
            <p className="font-inter font-medium  text-16 letter-spacing- line-height-100  ">
              Today's Sessions:{" "}
              <span className="font-inter font-medium  text-16 letter-spacing-0 line-height-100 ">
                {day.length}
              </span>
            </p>
            <div className="flex flex-row gap-5 mt-2">
              <p className="text-green-600 border-r-2 border-gray-300 pr-3 font-inter font-medium  text-16 letter-spacing-0 line-height-100 ">
                {t("common.tableHeaders.completed")}:{" "}
                <span className="font-inter font-medium  text-16 letter-spacing-0 line-height-100 ">
                  {toDaySession}
                </span>
              </p>
              <p className="text-orange-500 font-inter font-medium  text-16 letter-spacing-0 line-height-100 ">
                {t("common.tableHeaders.pending")}:{" "}
                <span className="font-inter font-medium  text-18 letter-spacing-0 line-height-100 ">
                  {day.length - toDaySession}
                </span>
              </p>
            </div>
          </div>
        </section>
        <div className="flex flex-col items-center justify-center w-[400px] h-[170px] bg-[#FCFCFC] dark:bg-gray-700 border-b-4 border-[#08B391] rounded-lg">
          <div>
            <p className="text-[16px] font-semibold ">Today's Locations :</p>
          </div>
          <div className="w-full h-full overflow-y-auto px-2">
            <ul className="list-disc list-inside space-y-2 mt-2">
              {day && day.length > 0 ? (
                day.some((s) => s.loginLat !== null && s.loginLong !== null) ? (
                  day.map((session: SessionProps, index: number) =>
                    session.loginLocation !== null ? (
                      <li
                        key={index}
                        className={`border-b border-gray-300 pb-1 mb-1 ${
                          session.status === 1 ? "text-red-400" : "text-custom"
                        }`}
                      >
                        <div className="inline-flex items-center">
                          <span
                            className=" block w-[330px] font-inter text-14 leading-tight"
                            title={session.loginLocation}
                          >
                            {session.loginLocation}
                          </span>
                        </div>
                      </li>
                    ) : null
                  )
                ) : (
                  <li className="flex items-center justify-center">
                    <span className="text-red-500 mt-2 p-2">
                      No Valid Location Data
                    </span>
                  </li>
                )
              ) : (
                <li className="flex items-center justify-center">
                  <span className="text-red-500 mt-2 p-2">
                    No Data Available
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className=" rounded-xl ">
        <section className="flex items-center justify-between">
          <h3
            className="mt-2"
            style={{
              fontFamily: "Inter",
              fontWeight: 400,
              fontStyle: "normal",
              fontSize: "16px",
              letterSpacing: "0px",
              lineHeight: "11.09px",
            }}
          >
            Services Details
          </h3>
          <div className=" ">
            {" "}
  <PillButton
  variant="basic"
  ref={filterButtonRef}
  onClick={() => setIsFilterOpen(!isFilterOpen)}
  className={`relative w-auto flex items-center
    ${
      hasActiveFilters
        ? "bg-blue-100 dark:bg-[#1E3A8A] border-blue-400 dark:border-blue-500 text-black dark:text-white"
        : "bg-white border-gray-300 text-black dark:bg-gray-700 dark:text-white"
    }`}
    style={{ left: '-15px' }}// shift button left
>
  <FontAwesomeIcon
    icon={faFilter}
    className={hasActiveFilters ? "text-black dark:text-white" : ""}
  />

  <span className="text-black dark:text-white" style={{ marginLeft: '10px' }}>Filter</span>

  {/* Count badge */}
  {filterCount > 0 && (
    <span className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
      {filterCount}
    </span>
  )}

  {/* Green dot */}
  {hasActiveFilters && (
    <span className="absolute top-1 left-8 h-2 w-2 bg-green-500 rounded-full" />
  )}
</PillButton>

            {/* <button
              ref={filterButtonRef}
              type="button"
              className="justify-center   px-5 py-2 w-[96px] h-[32px] flex items-center border border-gray-400   dark:border-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg  transition-shadow duration-300 "
              onClick={() => {
                setIsFilterOpen(!isFilterOpen);
              }}
            >
              <FontAwesomeIcon icon={faFilter} className="" />
              <span className="ml-2">Filter</span>
            </button> */}
            {isFilterOpen && (
              <div
                ref={filterRef}
                className="absolute top-[220px] right-36 z-50 bg-white dark:bg-gray-800 dark:border dark:border-white shadow-lg rounded-md border border-gray-200  w-[340px] sm:w-[400px] transition-all duration-200"
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
                   className="ml-auto mr-3 text-xs bg-blue-500 text-white px-2 py-0.5 rounded flex items-center" >
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
                  <SessionFilter submit={submit} hideUserField={true} />
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="overflow-y-auto">
          <DataTable
            data={sessions}
            columns={tableData}
            onRowClick={onRowClick}
            theadHeight="h-[calc(100vh-420px)]"
            actions={["view"]}
             onView={onRowClick}
          ></DataTable>
        </div>
      </div>

      {isView && (
        <GenericModal
          isOpen={isView}
          onClose={() => setIsView(false)}
          header="Session Details "
          customWidth="calc(100vw - 32px)"
          customHeight="calc(100vh - 32px)"
        >
          <SessionDetails data={viewData} isLoading={isLoading} />
        </GenericModal>
      )}
    </div>
  );
};

export default EmployeeDetail;
