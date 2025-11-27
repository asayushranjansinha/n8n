"use client";

import { useCredentialsSearchParams } from "@/features/credentials/hooks/useCredentialSearchParams";
import { useEntitySearch } from "@/hooks/useEntitySearch";

import { EntitySearch } from "@/components/entity/EntitySearch";

export const CredentialSearch = () => {
  const [params, setParams] = useCredentialsSearchParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Credentials"
    />
  );
};
