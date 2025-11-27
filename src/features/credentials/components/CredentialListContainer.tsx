import { EntityContainer } from "@/components/entity/EntityContainer";

import { CredentialListHeader } from "./CredentialListHeader";
import { CredentialPagination } from "./CredentialPagination";
import { CredentialSearch } from "./CredentialSearch";

export const CredentialListContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialListHeader />}
      search={<CredentialSearch />}
      pagination={<CredentialPagination />}
    >
      {children}
    </EntityContainer>
  );
};
