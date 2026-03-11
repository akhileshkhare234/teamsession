import React, { useState } from "react";
import SearchBar from "components/search/CustomSearchBar";

// Example data structure for the table
interface ExampleData {
  id: number;
  name: string;
  email: string;
  role: string;
}

const SearchExample: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Example data for the table
  const exampleData: ExampleData[] = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "Manager" },
    { id: 4, name: "Sarah Williams", email: "sarah@example.com", role: "User" },
    {
      id: 5,
      name: "David Brown",
      email: "david@example.com",
      role: "Developer",
    },
  ];

  // Columns for the table
  const columns = [
    { header: "ID", accessor: "id" as keyof ExampleData, sortable: true },
    {
      header: "Name",
      accessor: "name" as keyof ExampleData,
      sortable: true,
      searchable: true,
    },
    {
      header: "Email",
      accessor: "email" as keyof ExampleData,
      sortable: true,
      searchable: true,
    },
    { header: "Role", accessor: "role" as keyof ExampleData, sortable: true },
  ];

  // Filter data based on search term
  const filteredData = exampleData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("Filtered Data:", filteredData);
  console.log("Search Term:", searchTerm);
  console.log("Example Data:", columns);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Search Example</h2>

      {/* Different SearchBar variants */}
      <div className="space-y-4 mb-8">
        <div>
          <h3 className="mb-2">Default SearchBar</h3>
          <SearchBar
            placeholder="Search by name or email..."
            onSearch={setSearchTerm}
          />
        </div>

        <div>
          <h3 className="mb-2">Minimal SearchBar</h3>
          <SearchBar
            placeholder="Search..."
            onSearch={setSearchTerm}
            variant="minimal"
            size="small"
          />
        </div>

        <div>
          <h3 className="mb-2">Bordered SearchBar</h3>
          <SearchBar
            placeholder="Search..."
            onSearch={setSearchTerm}
            variant="bordered"
            size="large"
          />
        </div>
      </div>

      {/* Table with search integration */}
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">Users Table</h3>
        <div className="w-64">
          <SearchBar
            placeholder="Search users..."
            onSearch={setSearchTerm}
            size="small"
          />
        </div>
      </div>

      {/* <Table
        data={filteredData}
        columns={columns}
        pagination={true}
        rowKey="id"
      /> */}
    </div>
  );
};

export default SearchExample;
