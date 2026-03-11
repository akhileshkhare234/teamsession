import React from "react";
// import httpClient from "services/network/httpClient";
import { useTranslation } from "react-i18next";
// import Loader from "components/Loader";

interface CountProps {
  completedServices: number;
  pendingServices: number;
}
interface NewCountProps {
  countStore: CountProps;
}
const CountSessions = ({ countStore }: NewCountProps) => {
  const { t } = useTranslation();
  console.log(countStore);

  return (
    <div className="w-full h-full  space-y-4 transition-all duration-300 ease-in-out">
      {/* <h2 className="text-xl font-semibold mb-4 text-gray-800">Session Overview</h2> */}

      <div className="grid  grid-cols-2 gap-4 h-full dark:bg-gray-800">
        <div className="bg-[#FCFCFC] p-6 rounded-xl  transition-shadow dark:bg-gray-600 duration-300 border-b-4 border-green-500">
          <div className="flex flex-col items-center justify-center h-full space-y-3 gap-5">
            <h3
              className=""
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "14px",
                letterSpacing: "0px",
                lineHeight: "11.09px",
              }}
            >
              {t("common.tableHeaders.completed")} Sessions
            </h3>
            <span
              className=" "
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "32px",
                letterSpacing: "0px",
                lineHeight: "11.09px",
              }}
            >
              {countStore?.completedServices || 0}
            </span>
          </div>
        </div>

        <div className="bg-[#FCFCFC] p-7 rounded-xl  dark:bg-gray-600  transition-shadow duration-300 border-b-4 border-orange-400">
          <div className="flex flex-col items-center justify-center h-full space-y-3 gap-5">
            <h3
              className=" "
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "14px",
                letterSpacing: "0px",
                lineHeight: "11.09px",
              }}
            >
              {t("common.tableHeaders.pending")} Sessions
            </h3>
            <span
              className=" font-Inter text-[32px]"
              style={{
                fontFamily: "Inter",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "32px",
                letterSpacing: "0px",
                lineHeight: "11.09px",
              }}
            >
              {countStore?.pendingServices || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountSessions;
