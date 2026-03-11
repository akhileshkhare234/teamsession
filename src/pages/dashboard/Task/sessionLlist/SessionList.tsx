import React, { useEffect, useState } from "react";
// import NoImage from "assets/No-Data.jpg";
import httpClient from "services/network/httpClient";
import SessionDetails from "./SessionModal";
import { SessionData } from "./SessionTypes";

interface SessionProp {
  viewResponsive: any;
}

const SessionList: React.FC<SessionProp> = ({ viewResponsive }) => {
  const [sessions, setSessions] = useState<SessionData>();
  const [isLoading, setIsLoading] = useState(false);

  //   const sessionData: SessionProps[] = [
  //     {
  //       id: 1,
  //       customerName: "John Doe",
  //       loginTime: "2024-03-24T08:30:00Z",
  //       loginLat: "37.7749",
  //       loginLong: "-122.4194",
  //       //   logoutTime: "2024-03-24",
  //       //   logoutLat: "37.7750",
  //       //   logoutLong: "-122.4195",
  //       status: 1,
  //       tags: [
  //         {
  //           id: 101,
  //           tagName: "Nature",
  //           images: [
  //             {
  //               id: 201,
  //               imageUrl: "assets/No-Data.jpg",
  //               latitude: "37.7749",
  //               longitude: "-122.4194",
  //             },
  //             {
  //               id: 202,
  //               imageUrl: "https://example.com/image2.jpg",
  //               latitude: "37.7751",
  //               longitude: "-122.4196",
  //             },
  //             {
  //               id: 202,
  //               imageUrl: "https://example.com/image2.jpg",
  //               latitude: "37.7751",
  //               longitude: "-122.4196",
  //             },
  //             {
  //               id: 202,
  //               imageUrl: "https://example.com/image2.jpg",
  //               latitude: "37.7751",
  //               longitude: "-122.4196",
  //             },
  //             {
  //               id: 202,
  //               imageUrl: "https://example.com/image2.jpg",
  //               latitude: "37.7751",
  //               longitude: "-122.4196",
  //             },
  //             {
  //               id: 202,
  //               imageUrl: "https://example.com/image2.jpg",
  //               latitude: "37.7751",
  //               longitude: "-122.4196",
  //             },
  //             {
  //               id: 202,
  //               imageUrl: "https://example.com/image2.jpg",
  //               latitude: "37.7751",
  //               longitude: "-122.4196",
  //             },
  //           ],
  //         },
  //         {
  //           id: 102,
  //           tagName: "Architecture",
  //           images: [
  //             {
  //               id: 203,
  //               imageUrl: "https://example.com/image3.jpg",
  //               latitude: "37.7760",
  //               longitude: "-122.4180",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       id: 2,
  //       customerName: "Jane Smith",
  //       loginTime: "2024-03-23T09:00:00Z",
  //       loginLat: "34.0522",
  //       loginLong: "-118.2437",
  //       //   logoutTime: "2024-03-23",
  //       //   logoutLat: "34.0523",
  //       //   logoutLong: "-118.2438",
  //       status: 0,
  //       tags: [
  //         {
  //           id: 103,
  //           tagName: "Wildlife",
  //           images: [
  //             {
  //               id: 204,
  //               imageUrl: "https://example.com/image4.jpg",
  //               latitude: "34.0522",
  //               longitude: "-118.2437",
  //             },
  //             {
  //               id: 205,
  //               imageUrl: "https://example.com/image5.jpg",
  //               latitude: "34.0524",
  //               longitude: "-118.2439",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ];

  useEffect(() => {
    setIsLoading(true);
    const fetchImages = async () => {
      try {
        const response: any = await httpClient.get(
          `services/user/${viewResponsive.userId}`
        );
        console.log(response);
        setSessions(response.value || []);
        // setSearchQuery("");
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (viewResponsive.userId) {
      fetchImages();
    }
    // setSessions(sessionData);
  }, [viewResponsive.userId]);

  return (
    // <div className="h-[calc(100vh-50px)] bg-gray-100 w-[calc(95vw-50px)] overflow-hidden">
    //   {sessions.map((customer) => (
    //     <div className="ml-5">
    //       <span className="text-lg font-medium m-2">
    //         {customer.customerName}
    //       </span>
    //       {customer.tags.map((tag) => (
    //         <div>
    //           <span className="block text-sm font-medium p-5 mt-5 ml-2 ">
    //             {tag.tagName}
    //           </span>
    //           <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ">
    //             {tag.images.map((images) => (
    //               <img
    //                 src={images.imageUrl}
    //                 alt={tag.tagName}
    //                 className="w-full h-60 object-cover transition-transform transform hover:scale-110"
    //                 onClick={() => clickImage(images)}
    //               ></img>
    //             ))}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   ))}
    //   {selectedImage && (
    //     <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-10">
    //       <div className="max-w-md w-full items-center justify-center">
    //         <button
    //           className="absolute text-white top-5 left-5 text-xl"
    //           onClick={closeImage}
    //         >
    //           ✕
    //         </button>
    //         <img
    //           src={selectedImage.imageUrl}
    //           alt={"Selected"}
    //           className="h-[calc(90vh-50px)] w-full"
    //         />
    //         <div className="bg-white mt-2 flex items-center justify-center gap-5">
    //           <button className="p-2 bg-blue-400 hover:bg-blue-800 rounded shadow-md border border-gray-400 m-2 w-28">
    //             Share
    //           </button>
    //           <button
    //             className="p-2 bg-red-400 hover:bg-red-800 rounded shadow-md border border-gray-400 m-2 w-28"
    //             onClick={() => deleteImage(selectedImage.imageUrl)}
    //           >
    //             Delete
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className="w-[calc(90vw-50px)]">
      {sessions && <SessionDetails data={sessions} isLoading={isLoading} />}
    </div>
  );
};

export default SessionList;
