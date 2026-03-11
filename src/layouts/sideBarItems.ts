import { FaHome } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";

export interface SidebarItem {
  name: string;
  icon: any;
  url: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    name: "Home",
    icon: FaHome,
    url: "/admin/dashboard",
  },
  {
    name: "Employees",
    icon: FaUserGroup,
    url: "/admin/employees",
  },
  // {
  //   name: "Products",
  //   icon: MdProductionQuantityLimits,
  //   url: "/admin/products",
  // },
  // {
  //   name: "Farmers",
  //   icon: GiFarmer,
  //   url: "/admin/farmers",
  // },
  // {
  //   name: "Crops",
  //   icon: PiPlantFill,
  //   url: "/admin/crops",
  // },
  // {
  //   name: "Distributores",
  //   icon: MdTransferWithinAStation,
  //   url: "/admin/distributors",
  // },
  // {
  //   name: "Logout",
  //   icon: AiOutlinePoweroff,
  //   url: "/admin/distributors",
  // },
];
