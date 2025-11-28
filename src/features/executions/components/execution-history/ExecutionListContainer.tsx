import { EntityContainer } from "@/components/entity/EntityContainer";

import { ExecutionListHeader } from "./ExecutionListHeader";
import { ExecutionPagination } from "./ExecutionPagination";


export const ExecutionListContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<ExecutionListHeader />}
      pagination={<ExecutionPagination />}
    >
      {children}
    </EntityContainer>
  );
};
