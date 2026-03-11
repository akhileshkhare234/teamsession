// import React, { useEffect, useState } from "react";
// import httpClient from "../../services/network/httpClient";
// import Loader from "components/Loader";

// interface SessionProps {
//   id: number;
//   customerName: string;
//   loginTime: string;
//   loginLat: string;
//   loginLong: string;
//   logoutTime: string;
//   logoutLat: string;
//   logoutLong: string;
//   status: number;
//   logoutDate: string;
//   loginDate: string;
// }

// interface EmployeeDetailProps {
//   data: any;
//   allEmployees: any[];
//   currentIndex: number;
//   onNavigate: (newIndex: number) => void;
//   onBack: () => void;
// }

// const EmployeeDetail: React.FC<EmployeeDetailProps> = ({
//   data,
//   allEmployees,
//   currentIndex,
//   onNavigate,
//   onBack,
// }) => {
//   const [sessions, setSessions] = useState<SessionProps[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(5);

//   useEffect(() => {
//     if (data?.id) {
//       setIsLoading(true);
//       httpClient
//         .get(`services/user/${data.id}`)
//         .then((response: any) => {
//           const formattedSessions = response.value.map(
//             (session: SessionProps) => ({
//               ...session,
//               loginDate: session.loginTime?.split("T")[0],
//               loginTime: session.loginTime?.split("T")[1]?.slice(0, 5),
//               logoutDate: session.logoutTime?.split("T")[0],
//               logoutTime: session.logoutTime?.split("T")[1]?.slice(0, 5),
//             })
//           );
//           setSessions(formattedSessions);
//         })
//         .catch((error) => {
//           console.error(error);
//         })
//         .finally(() => {
//           setIsLoading(false);
//         });
//     }
//   }, [data]);

//   const handlePrevious = () => {
//     if (currentIndex > 0) {
//       onNavigate(currentIndex - 1);
//     }
//   };

//   const handleNext = () => {
//     if (currentIndex < allEmployees.length - 1) {
//       onNavigate(currentIndex + 1);
//     }
//   };

//   const getStats = () => {
//     const completed = sessions.filter((s) => s.status === 1).length;
//     const total = sessions.length;
//     const pending = total - completed;

//     return {
//       total,
//       completed,
//       pending,
//       newSessions: Math.floor(total * 0.3),
//       followUps: Math.floor(total * 0.7),
//     };
//   };

//   const stats = getStats();

//   // Get current sessions for pagination
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentSessions = sessions.slice(indexOfFirstItem, indexOfLastItem);

//   // Change page
//   const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

//   const pageNumbers = [];
//   for (let i = 1; i <= Math.ceil(sessions.length / itemsPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   return (
//       {isLoading ? (
//         <Loader></Loader>
//       ) : (
//         <div className="flex flex-col space-y-3 h-full overflow-y-auto px-3 py-2">
//           {/* Profile Section */}
//           <button
//             className="mb-2 px-4 py-2 bg-gray-500 text-white rounded"
//             onClick={onBack} // ✅ Clicking this will close the details view
//           >
//             Back
//           </button>
//           <div className="flex items-start justify-between space-x-4 bg-white p-3 rounded-lg shadow-sm">
//             <div className="flex items-start space-x-4">
//               <div className="w-20 h-20 rounded-lg overflow-hidden">
//                 <img
//                   src={data.profileImage || "https://via.placeholder.com/96"}
//                   alt="Profile"
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//               <div className="flex-1">
//                 <h2 className="text-lg font-bold">{data.firstName}</h2>
//                 <p className="text-gray-600 text-sm">{data.employeeCode}</p>
//                 <p className="text-gray-600 text-sm">{data.designation}</p>
//                 <p className="text-gray-600 text-sm">{data.mobile}</p>
//               </div>
//             </div>
//             <div className="flex space-x-2 shrink-0">
//               <button
//                 onClick={handlePrevious}
//                 disabled={currentIndex === 0}
//                 className={`px-3 py-1 text-sm border border-gray-300 rounded ${currentIndex === 0 ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"}`}
//               >
//                 Previous Employee
//               </button>
//               <button
//                 onClick={handleNext}
//                 disabled={currentIndex === allEmployees.length - 1}
//                 className={`px-3 py-1 text-sm border border-gray-300 rounded ${currentIndex === allEmployees.length - 1 ? "bg-gray-100 cursor-not-allowed" : "hover:bg-gray-50"}`}
//               >
//                 Next Employee
//               </button>
//             </div>
//           </div>

//           {/* Today's Stats */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* Demo Target */}
//             <div className="bg-white p-4 rounded-lg border border-gray-200">
//               <h3 className="font-semibold mb-3">Service </h3>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-3xl font-bold">{stats.total}</p>
//                   {/* <p className="text-sm text-gray-500">Locations</p> */}
//                   <p className="text-xs text-gray-400">
//                     {/* {stats.newSessions} new and {stats.followUps} follow ups */}
//                   </p>
//                 </div>
//                 <div className="flex space-x-4">
//                   <div className="text-center">
//                     <p className="text-xl font-semibold text-green-600">
//                       {stats.completed}
//                     </p>
//                     <p className="text-sm text-gray-500">Completed</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xl font-semibold text-orange-600">
//                       {stats.pending}
//                     </p>
//                     <p className="text-sm text-gray-500">Pending</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Visit Target */}
//             {/* <div className="bg-white p-4 rounded-lg border border-gray-200">
//               <h3 className="font-semibold mb-3">Visit Target</h3>
//               <div className="flex justify-between items-center">
//                 <div>
//                   <p className="text-3xl font-bold">{stats.total}</p>
//                   <p className="text-sm text-gray-500">Locations</p>
//                   <p className="text-xs text-gray-400">
//                     {stats.newSessions} new and {stats.followUps} follow ups
//                   </p>
//                 </div>
//                 <div className="flex space-x-4">
//                   <div className="text-center">
//                     <p className="text-xl font-semibold text-green-600">
//                       {stats.completed}
//                     </p>
//                     <p className="text-sm text-gray-500">Completed</p>
//                   </div>
//                   <div className="text-center">
//                     <p className="text-xl font-semibold text-orange-600">
//                       {stats.pending}
//                     </p>
//                     <p className="text-sm text-gray-500">Pending</p>
//                   </div>
//                 </div>
//               </div>
//             </div> */}
//           </div>

//           {/* Location Details */}
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             <div className="p-4 border-b border-gray-200">
//               <h3 className="font-semibold">Location details</h3>
//             </div>
//             <div className="p-4 space-y-2">
//               {sessions.slice(0, 4).map((session, index) => (
//                 <div key={index} className="flex items-center space-x-2">
//                   <div className="w-2 h-2 rounded-full bg-green-500"></div>
//                   <p className="text-sm">{session.customerName}</p>
//                   <p className="text-sm text-gray-500">
//                     ~{session.loginLat}, {session.loginLong}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Demo and Visit Details Table */}
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden flex-1">
//             <div className="p-4 border-b border-gray-200 flex justify-between items-center">
//               <h3 className="font-semibold">Services and Visit details</h3>
//               <select className="text-sm border border-gray-300 rounded px-2 py-1">
//                 <option>All</option>
//               </select>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
//                       Client Name
//                     </th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
//                       Login Time
//                     </th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
//                       Client Location
//                     </th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
//                       Logout Time
//                     </th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
//                       Status
//                     </th>
//                     <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-200">
//                   {currentSessions.map((session, index) => (
//                     <tr key={index}>
//                       <td className="px-4 py-2 text-sm">
//                         {session.customerName}
//                       </td>
//                       <td className="px-4 py-2 text-sm">{session.loginTime}</td>
//                       <td className="px-4 py-2 text-sm">{`${session.loginLat}, ${session.loginLong}`}</td>
//                       <td className="px-4 py-2 text-sm">
//                         {session.logoutTime}
//                       </td>
//                       {/* <td className="px-4 py-2 text-sm">{`${session.loginLat}, ${session.loginLong}`}</td> */}
//                       {/* <td className="px-4 py-2 text-sm">SID-{session.id}</td> */}
//                       <td className="px-4 py-2 text-sm">
//                         <span
//                           className={`px-2 py-1 text-xs font-medium ${session.status === 1 ? "text-green-700 bg-green-100" : "text-orange-700 bg-orange-100"} rounded-full`}
//                         >
//                           {session.status === 1 ? "Completed" : "Pending"}
//                         </span>
//                       </td>
//                       <td className="px-4 py-2 text-sm">
//                         <button className="text-gray-400 hover:text-gray-600">
//                           <svg
//                             className="w-5 h-5"
//                             fill="currentColor"
//                             viewBox="0 0 20 20"
//                           >
//                             <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
//                           </svg>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//               <div className="flex justify-center mt-4 space-x-2">
//                 {pageNumbers.map((number) => (
//                   <button
//                     key={number}
//                     onClick={() => paginate(number)}
//                     className={`px-3 py-1 text-sm border rounded ${currentPage === number ? "bg-blue-500 text-white" : "border-gray-300 hover:bg-gray-50"}`}
//                   >
//                     {number}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//   );
// };

// export default EmployeeDetailModal;
import React from "react";
const EmployeeDetailModal = () => {
  return <div>Employee Detail Modal</div>;
};

export default EmployeeDetailModal;
