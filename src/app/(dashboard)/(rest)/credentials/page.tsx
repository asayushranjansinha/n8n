import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { HydrateClient } from "@/trpc/server";

import {
  CredentialList,
  CredentialsError,
  CredentialsLoading,
} from "@/features/credentials/components/CredentialLIst";
import { CredentialListContainer } from "@/features/credentials/components/CredentialListContainer";

import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";
import { prefetchcredentials } from "@/features/credentials/server/prefetch";

type PageProps = {
  searchParams: Promise<SearchParams>;
};

const CredentialsPage = async ({ searchParams }: PageProps) => {
  const params = await credentialsParamsLoader(searchParams);
  prefetchcredentials(params);
  return (
    <CredentialListContainer>
      <HydrateClient>
        <ErrorBoundary fallback={<CredentialsError />}>
          <Suspense fallback={<CredentialsLoading />}>
            <CredentialList />
          </Suspense>
        </ErrorBoundary>
      </HydrateClient>
    </CredentialListContainer>
  );
};

export default CredentialsPage;
