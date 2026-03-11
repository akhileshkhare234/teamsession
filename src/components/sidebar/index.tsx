import React from "react";
import classNames from "classnames";
import { Link, useLocation } from "react-router-dom";

interface MenuItem {
  label: string;
  type: "screen" | "link";
  screen?: string;
  link?: string;
}

interface MenuGroup {
  title: string;
  submenu: MenuItem[];
}

interface SidebarProps {
  menuData: MenuGroup[];
  activeScreen?: string;
  onSetActiveScreen?: (screen: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuData,
  activeScreen,
  onSetActiveScreen,
}) => {
  const location = useLocation();

  return (
    <div className="min-w-[200px] h-screen bg-green-50 border-r border-gray-200 dark:bg-green-800 dark:border-green-700">
      {menuData.map((group, index) => (
        <div key={index} className="mb-4">
          <div className="px-4 py-2 text-lg font-bold dark:text-gray-50">
            {group.title}
          </div>
          <div className="px-4">
            {group.submenu.map((item, itemIndex) => {
              const isActive =
                item.type === "screen"
                  ? activeScreen === item.screen
                  : location.pathname === item.link;

              return item.type === "screen" ? (
                <div
                  key={itemIndex}
                  onClick={() => {
                    console.log("Screen : ", item.screen);
                    item.screen && onSetActiveScreen?.(item.screen);
                  }}
                  className={classNames(
                    "cursor-pointer px-4 py-2 text-gray-700 dark:text-gray-100 hover:text-gray-900 hover:bg-gray-300 dark:hover:bg-gray-200 dark:hover:text-gray-700 rounded-3xl my-1",
                    {
                      "bg-green-200 dark:bg-green-500 font-semibold": isActive,
                    }
                  )}
                >
                  {item.label}
                </div>
              ) : (
                <Link
                  to={item.link || "/"}
                  key={itemIndex}
                  className={classNames(
                    "block px-4 py-2 hover:bg-gray-200 dark:hover:bg-gray-200 rounded-3xl my-1",
                    {
                      "bg-gray-300 dark:bg-green-800 font-semibold": isActive,
                    }
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
