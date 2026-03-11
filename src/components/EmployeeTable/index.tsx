import React from "react";
import DataTable from "components/DataTable";

interface Tag {
  id: number;
  tagName: string;
  images: {
    id: number;
    imageUrl: string;
    latitude: string;
    longitude: string;
  }[];
}

interface EmployeeData {
  id: number;
  customerName?: string;
  loginTime: string;
  loginLat: string;
  loginLong: string;
  logoutTime: string;
  logoutLat: string;
  logoutLong: string;
  status: number;
  tags: Tag[];
}

interface EmployeeTableProps {
  data: EmployeeData[];
  onRowClick?: (employee: EmployeeData) => void;
}

const formatDateTime = (dateTimeStr: string) => {
  const date = new Date(dateTimeStr);
  return date.toLocaleString();
};

const formatLocation = (lat: string, long: string) => {
  return `${lat}, ${long}`;
};

const EmployeeTable: React.FC<EmployeeTableProps> = ({ data, onRowClick }) => {
  const columns = [
    { header: "Customer Name", accessor: "customerName" as keyof EmployeeData },
    { header: "Login Time", accessor: "loginTime" as keyof EmployeeData },
    {
      header: "Login Location",
      accessor: "loginLocation" as keyof EmployeeData,
    },
    { header: "Logout Time", accessor: "logoutTime" as keyof EmployeeData },
    {
      header: "Logout Location",
      accessor: "logoutLocation" as keyof EmployeeData,
    },
    {
      header: "Logout Location",
      accessor: "logoutLocation" as keyof EmployeeData,
    },
    {
      header: "Status",
      accessor: "status" as keyof EmployeeData,
      cell: (row: EmployeeData) => (row.status === 1 ? "Active" : "Inactive"),
    },
  ];

  const formattedData = data.map((employee) => ({
    ...employee,
    customerName: employee.customerName || "N/A",
    loginTime: formatDateTime(employee.loginTime),
    logoutTime: formatDateTime(employee.logoutTime),
    loginLocation: formatLocation(employee.loginLat, employee.loginLong),
    logoutLocation: formatLocation(employee.logoutLat, employee.logoutLong),
  }));

  return (
    <DataTable
      columns={columns}
      data={formattedData}
      onRowClick={onRowClick}
      isSearch={true}
      itemsPerPages={10}
    />
  );
};

export default EmployeeTable;
