import React, { ReactNode, useState } from "react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

const Tooltip = ({ content, children }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <>
      <div
        className="relative inline-block"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}

        {isVisible && (
          <div
            className={`absolute left-1/2 z-50	 ml-auto mr-auto min-w-max -translate-x-1/2 scale-0 transform rounded-lg px-3 py-2 text-xs font-medium transition-all duration-500 group-hover:scale-100`}
          >
            <div className="flex max-w-xs flex-col items-center shadow-lg">
              <div className="clip-bottom h-2 w-4 bg-gray-800"></div>

              <div className="rounded bg-gray-800 p-2 text-center text-xs text-white">
                {content}
              </div>
            </div>
            {/* {content}
            <div className="tooltip-arrow" data-popper-arrow></div> */}
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(Tooltip);
