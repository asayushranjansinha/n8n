import React from "react";

type EntityContainerProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
};
export const EntityContainer = ({
  children,
  header,
  pagination,
  search,
}: EntityContainerProps) => {
  return (
    <div className="p-4 flex-1 flex flex-col gap-4">
      <div className="w-full flex flex-col gap-y-8">{header}</div>

      <div className="flex flex-col gap-y-4 border-2 flex-1">
        {search}
        {children}
      </div>
      {pagination}
    </div>
  );
};
