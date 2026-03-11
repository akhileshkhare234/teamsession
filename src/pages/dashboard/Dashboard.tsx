import React, { useEffect, useState, useRef } from "react";
import RechartComponent from "./ChartBar/RechartComponent";
import EmployeeTasks from "./Task/EmployeeTasks";
import CountSessions from "./sessionsCount/CountSessions";
import httpClient from "services/network/httpClient";
import SessionFilter from "components/filter/SessionFilter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFilter,
  faTimes,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { downloadFile } from "utility/downloadPDF ";
import AuthManager from "services/auth/AuthManager";
import SearchBar from "components/search/CustomSearchBar";
import NoData from "components/NoData";
import appConfig from "services/config";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

interface CompletedServices {
  completedServices: number;
  pendingServices: number;
}
const Dashboard = () => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);
  const [isGenerateDocsOpen, setIsGenerateDocsOpen] = React.useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const generateDocsRef = useRef<HTMLDivElement>(null);
  const generateDocsButtonRef = useRef<HTMLButtonElement>(null);
  const [monthlyCount, setMonthlyCount] = React.useState<any[]>([]);
  const [totalCount, setTotalCount] = React.useState<CompletedServices>();
  const [performanceData, setPerformanceData] = React.useState<any[]>([]);
  const [year, setYear] = useState<number>(0);
  const [currentFilters, setCurrentFilters] = useState<any>({});
  const token = AuthManager.getToken();
  const [loading, setLoading] = useState<boolean>(false);
  const [hasActiveFilters, setHasActiveFilters] = useState<boolean>(false);
  const [filterCount, setFilterCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const baseURL = appConfig.getBaseUrl();

  const sortByKey = (array: any, key: any): Array<any> => {
    return array.sort((a: any, b: any) => {
      const keyA = a[key].toLowerCase();
      const keyB = b[key].toLowerCase();
      if (keyA < keyB) {
        return -1;
      }
      if (keyA > keyB) {
        return 1;
      }
      return 0;
    });
  };

  useEffect(() => {
    setLoading(true);
    httpClient
      .get("services/dashboard-stats")
      .then((response: any) => {
        console.log("Dashboard stats response:", response);
        // Handle the response data as needed
        if (response.success) {
          const formattedData = response.value.monthlyCounts
            .map((item: any) => ({
              ...item,
              month: monthNames[item.month - 1],
              originalMonth: item.month, // Keep numeric month for sorting
            }))
            .sort((a: any, b: any) => a.originalMonth - b.originalMonth);

          const store = response.value.monthlyCounts.map(
            (years: any) => years.year
          );
          setYear(store[0]);
          console.log("Formatted monthly data:", formattedData);
          console.log("Total counts:", response.value.totalCounts);
          sortByKey(response.value.performanceStats, "employeeName");

          setMonthlyCount(formattedData);
          setTotalCount(response.value.totalCounts);
          setPerformanceData(response.value.performanceStats);
        }
      })
      .catch((error) => {
        console.error("Error fetching dashboard stats:", error);
        // Handle error appropriately
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);
console.log(monthlyCount);
console.log(performanceData);
console.log(totalCount);
  // Handle clicks outside of dropdown to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node) &&
        filterButtonRef.current &&
        !filterButtonRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }

      if (
        generateDocsRef.current &&
        !generateDocsRef.current.contains(event.target as Node) &&
        generateDocsButtonRef.current &&
        !generateDocsButtonRef.current.contains(event.target as Node)
      ) {
        setIsGenerateDocsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const submit = (data: any) => {
    setLoading(true);
    const url = new URLSearchParams();
    let appliedFiltersCount = 0;

    if (data.fromDate) {
      const fromDateConcat = data.fromDate + "T00:00:00Z";
      url.append("fromDate", fromDateConcat);
      appliedFiltersCount++;
    }
    if (data.toDate) {
      const toDateConcat = data.toDate + "T23:59:59Z";
      url.append("toDate", toDateConcat);
      appliedFiltersCount++;
    }
    if (data.month) {
      url.append("month", data.month);
      appliedFiltersCount++;
    }
    if (data.year) {
      url.append("year", data.year);
      appliedFiltersCount++;
    }
    if (data.status) {
      url.append("status", data.status);
      appliedFiltersCount++;
    }
    if (data.userId) {
      url.append("userId", data.userId);
      appliedFiltersCount++;
    }

    // Set filter indicator state
    setHasActiveFilters(appliedFiltersCount > 0);
    setFilterCount(appliedFiltersCount);

    console.log("Filter URL parameters:", url);
    console.log("Filter URL parameters:", url.toString());
    console.log("Filter data submitted:", data);
    setCurrentFilters(url.toString());
    httpClient
      .get(`services/dashboard-stats?${url.toString()}`)
      .then((response: any) => {
        console.log("Dashboard stats response:", response);
        // Handle the response data as needed
        if (response.success) {
          const formattedData = response.value.monthlyCounts
            .map((item: any) => ({
              ...item,
              month: monthNames[item.month - 1],
              originalMonth: item.month, // Keep numeric month for sorting
            }))
            .sort((a: any, b: any) => a.originalMonth - b.originalMonth);

          const store = response.value.monthlyCounts.map(
            (years: any) => years.year
          );
          setYear(store[0]);
          console.log("Formatted monthly data:", formattedData);
          console.log("Total counts:", response.value.totalCounts);

          sortByKey(response.value.performanceStats, "employeeName");

          setMonthlyCount(formattedData);
          setTotalCount(response.value.totalCounts);
          setPerformanceData(response.value.performanceStats);
          setIsFilterOpen(false); // Close filter dropdown after submission
        }
      })
      .catch((error) => {
        console.error("Error fetching filtered sessions:", error);
        // Handle error appropriately
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const generateReport = async (filterData: any) => {
    setLoading(true);
    console.log("Filter Data for Docs", filterData);

    try {
      const fromDates = filterData.fromDate
        ? `${filterData.fromDate}T00%3A00%3A00`
        : "";
      const toDates = filterData.toDate
        ? `${filterData.toDate}T23%3A59%3A59`
        : "";

      // Build URL with all possible parameters
      const queryString = [
        filterData.fromDate && `fromDate=${fromDates}`,
        filterData.toDate && `toDate=${toDates}`,
        filterData.typeId && `typeId=${filterData.typeId}`,
        filterData.status && `status=${filterData.status}`,
        filterData.month && `month=${filterData.month}`,
        filterData.year && `year=${filterData.year}`,
        filterData.userId && `userId=${filterData.userId}`,
      ]
        .filter(Boolean)
        .join("&");
      console.log("Query String for Docs", queryString);
      await downloadFile(
        `${baseURL}/services/generate-word-report?${queryString}`,
        `Session-document${filterData.month ? `-${filterData.month}` : ""}${filterData.year ? `-${filterData.year}` : ""} ${filterData.userId ? `-${filterData.userId}` : ""} ${filterData.fromDate ? `-${filterData.fromDate}` : ""} ${filterData.toDate ? `-${filterData.toDate}` : ""}.zip`,
        filterData,
        token ?? ""
      );
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setIsGenerateDocsOpen(false);
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setHasActiveFilters(false);
    setFilterCount(0);
    setCurrentFilters({});

    // Reload data with no filters
    httpClient.get("services/dashboard-stats").then((response: any) => {
      if (response.success) {
        // Process and set data (same code as in the original useEffect)
        const formattedData = response.value.monthlyCounts
          .map((item: any) => ({
            ...item,
            month: monthNames[item.month - 1],
            originalMonth: item.month,
          }))
          .sort((a: any, b: any) => a.originalMonth - b.originalMonth);

        const store = response.value.monthlyCounts.map(
          (years: any) => years.year
        );
        setYear(store[0]);
        sortByKey(response.value.performanceStats, "employeeName");

        setMonthlyCount(formattedData);
        setTotalCount(response.value.totalCounts);
        setPerformanceData(response.value.performanceStats);
        setIsFilterOpen(false);
      }
    });
  };

  const filteredData = searchTerm
    ? performanceData.filter(
        (item) =>
          item.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : performanceData;

 return (
  <div className="sm:flex flex-col h-[calc(100vh-64px)] w-full sm:overflow-hidden overflow-y-auto">
    <main className="flex-1 w-full overflow-hidden">
      {/* Top Bar: Search & Buttons */}
      <div className="sm:flex md:flex-row mt-2 justify-between items-center">
        {/* Search Bar */}
        <div className="w-36 md:max-w-xs sm:w-full gap-2">
          <SearchBar
            onSearch={setSearchTerm}
            variant="minimal"
            size="medium"
          />
        </div>

        {/* Filter & Generate Buttons */}
        <div className="flex justify-end items-center gap-4">
          {/* Filter Button */}
          <button
            ref={filterButtonRef}
            type="button"
            className={`justify-center border border-gray-300 dark:border-gray-600 ${
              hasActiveFilters
                ? "bg-blue-100 dark:bg-blue-900"
                : "dark:bg-gray-700"
            } text-gray-800 dark:text-white rounded-lg px-4 py-2 transition-shadow duration-300 z-10 flex items-center space-x-2 relative`}
            onClick={() => {
              setIsFilterOpen(!isFilterOpen);
              setIsGenerateDocsOpen(false);
            }}
          >
            <span className="relative">
              <FontAwesomeIcon icon={faFilter} />
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border border-white dark:border-gray-800"></span>
              )}
            </span>
            <span>Filter</span>
            {/* Filter Badge */}
            {hasActiveFilters && (
              <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {filterCount}
              </span>
            )}
          </button>

          {/* Generate Docs Button */}
          <button
            ref={generateDocsButtonRef}
            type="button"
            className="justify-center gap-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg px-4 py-2 transition-shadow duration-300 z-10 flex items-center space-x-2"
            onClick={() => {
              setIsGenerateDocsOpen(!isGenerateDocsOpen);
              setIsFilterOpen(false);
            }}
          >
            <FontAwesomeIcon icon={faDownload} className="gap-2" />
            Generate
          </button>

          {/* Filter Dropdown panel */}
          {isFilterOpen && (
            <div
              ref={filterRef}
              className="absolute top-28 right-12 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 w-[340px] sm:w-[400px] transition-all duration-200"
              style={{
                opacity: isFilterOpen ? 1 : 0,
                transform: isFilterOpen ? "translateY(0)" : "translateY(-10px)",
              }}
            >
              <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-white">
                  Filter Sessions
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
                <SessionFilter submit={submit} loading={loading} />
              </div>
            </div>
          )}

          {/* Generate Docs Dropdown */}
          {isGenerateDocsOpen && (
            <div
              ref={generateDocsRef}
              className="absolute top-16 right-0 z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 w-[340px] sm:w-[400px] transition-all duration-200"
              style={{
                opacity: isGenerateDocsOpen ? 1 : 0,
                transform: isGenerateDocsOpen
                  ? "translateY(0)"
                  : "translateY(-10px)",
              }}
            >
              <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="font-medium text-gray-800 dark:text-white">
                  Generate Documents
                </h3>
                <button
                  onClick={() => setIsGenerateDocsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="p-4">
                <SessionFilter
                  submit={generateReport}
                  buttonName="Generate"
                  loading={loading}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Counts & Charts */}
      {/*monthlyCount.length !== 0 && totalCount!==undefined && (*/}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="sm:w-full sm:h-[160px] mt-6 w-[calc(100%-50px)] rounded-xl">
          {/*{totalCount && (*/}
          <CountSessions
            countStore={{
              completedServices: totalCount?.completedServices || 0,
              pendingServices: totalCount?.pendingServices || 0,
            }}
          />
        </div>

        <div className="sm:w-full sm:h-[200px] w-[calc(100%-50px)] rounded-xl p-4">
          <RechartComponent
            monthDemo={monthlyCount || []}
            year={year}
            loading={loading}
          />
        </div>
      </section>

      {/* Employee Sessions Table */}
      <h2 className="text-[16px] font-normal text-gray-800 dark:text-white">
        Employee Sessions
      </h2>

{/*filteredData.length > 0 ? (*/}
      <section className="w-full">
        <div className="overflow-hidden h-full sm:w-full w-[calc(100%-50px)] rounded-md bg-white dark:bg-gray-800 dark:text-white">
          {filteredData.length > 0 ? (
            <EmployeeTasks
              taskData={filteredData}
              filterParams={currentFilters}
              loading={loading}
            />
          ) : (
            !loading && //searchTerm &&
            (
              <div className="flex flex-col items-center justify-center p-8">
                <NoData />
                {searchTerm ? (
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    No employees match your search criteria: "{searchTerm}"
                  </p>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 text-sm">
                    No employee sessions found.
                  </p>
                )}
              </div>
            )
          )}
        </div>
      </section>
    </main>
  </div>
);
};

export default Dashboard;
