import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDatabase } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";

interface NoDataProps {
  message?: string;
  className?: string;
  customeMessage?:string
}

const NoData: React.FC<NoDataProps> = ({
  message = "No data found",
  className = "",
  customeMessage,
}) => {
  const location = useLocation();
  const path = location.pathname.toLowerCase();

  const getAutoMessage = () => {
    if (path.includes("employees")) {
      return "No employees data available";
    }
    if (path.includes("dashboard")) {
      return "No employee sessions available";
    }
    if (path.includes("expenditure")) {
      return "No expenditure records available";
    }
    if (path.includes("emails")) {
      return "No Report recipient data available";
    }
    if (path.includes("catagory")) {
      return "No categories data available";
    }
    if (path.includes("advancepayment")) {
      return "No advance payment data available";
    }
    if (path.includes("paymentConfig")) {
      return "No paymentConfig data available";
    }
    return "No records available";
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-8 h-[calc(100vh-350px)] ${className}`}
    >
      <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-5 mb-4">
        <FontAwesomeIcon
          icon={faDatabase}
          className="text-gray-400 dark:text-gray-500 text-3xl"
        />
      </div>
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
        {message}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-xs">
       {customeMessage ?? getAutoMessage()}
      </p>
    </div>
  );
};

export default NoData;


