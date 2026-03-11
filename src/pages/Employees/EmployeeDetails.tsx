import React from "react";
// import { IoArrowBack } from "react-icons/io5";

const EmployeeDetails: React.FC<{ data: any }> = ({ data }) => {
  // const handleBack = () => {
  //   window.history.back();
  // };

  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-6">
        {/* <IoArrowBack className="text-xl cursor-pointer" onClick={handleBack} /> */}
        <h2 className="text-lg">Employee Name</h2>
        <div className="flex-grow text-right">
          <span className="mr-2">Hi Admin</span>
          <button className="bg-green-500 text-white px-4 py-1 rounded mr-2">
            Assign
          </button>
          <button className="border border-gray-300 px-4 py-1 rounded">
            Export
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex items-start gap-4">
          <img
            src={data.profileImage || "https://via.placeholder.com/80"}
            alt="Profile"
            className="w-20 h-20 rounded-lg"
          />
          {/* <div>
            <h3 className="text-lg font-medium">{data.firstName}</h3>
            <p className="text-gray-600">{data.employeeCode}</p>
            <p className="text-gray-600">{data.designation}</p>
            <p className="text-gray-600">{data.mobile}</p>
            <button className="text-blue-500 mt-2">View more</button>
          </div> */}
        </div>
      </div>

      {/* <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="mb-4">Demo Target</h4>
          <div className="flex justify-between mb-2">
            <span>10 Locations</span>
            <span className="text-gray-500">2 new entry / 7 follow ups</span>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Completed</p>
              <p className="text-2xl">7</p>
            </div>
            <div>
              <p className="font-medium">Pending</p>
              <p className="text-2xl">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="mb-4">Visit Target</h4>
          <div className="flex justify-between mb-2">
            <span>10 Locations</span>
            <span className="text-gray-500">2 new entry / 7 follow ups</span>
          </div>
          <div className="flex justify-between">
            <div>
              <p className="font-medium">Completed</p>
              <p className="text-2xl">7</p>
            </div>
            <div>
              <p className="font-medium">Pending</p>
              <p className="text-2xl">3</p>
            </div>
          </div>
        </div>
      </div> */}

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h4 className="mb-4">Location details</h4>
        <div className="space-y-3">
          {["-5KM", "-5KM", "-5KM", "-5KM"].map((distance, index) => (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${index === 0 ? "bg-green-500" : index === 1 ? "bg-yellow-500" : index === 2 ? "bg-red-500" : "bg-purple-500"}`}
              ></div>
              <span>Location name</span>
              <span className="text-gray-500 ml-auto">{distance}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h4 className="mb-4">Demo and Visit details</h4>
        <div className="mb-4">
          <select className="border rounded p-1 text-sm">
            <option>All</option>
          </select>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 text-left">Client Name</th>
              <th className="p-2 text-left">Phone number</th>
              <th className="p-2 text-left">Client Location</th>
              <th className="p-2 text-left">PID and Name</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Customer feedback</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t">
              <td className="p-2">Some name</td>
              <td className="p-2">1234567890</td>
              <td className="p-2">Vijaya nagar</td>
              <td className="p-2">PID 09345: some name</td>
              <td className="p-2">Completed</td>
              <td className="p-2">
                we may need 20 products by end of this week
              </td>
              <td className="p-2">...</td>
            </tr>
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4">
          <div>
            <select className="border rounded p-1 text-sm">
              <option>10</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button className="px-2 py-1 border rounded">Previous Page</button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((page) => (
              <button
                key={page}
                className={`px-2 py-1 rounded ${page === 6 ? "bg-green-500 text-white" : "border"}`}
              >
                {page}
              </button>
            ))}
            <button className="px-2 py-1 border rounded">Next Page</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;
