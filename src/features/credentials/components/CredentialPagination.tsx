import { useSuspenseCredentials } from "@/features/credentials/hooks/useCredentials";
import { useCredentialsSearchParams } from "@/features/credentials/hooks/useCredentialSearchParams";

import { EntityPagination } from "@/components/entity/EntityPagination";

export const CredentialPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsSearchParams();
  return (
    <EntityPagination
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      page={credentials.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};
