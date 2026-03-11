import React from "react";
import classNames from "classnames";

interface SkeletonProps {
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div
      className={classNames("animate-pulse bg-gray-200 rounded", className)}
    />
  );
};

export default Skeleton;
