import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CredentialView } from "@/features/credentials/components/CredentialView";
import { prefetchcredential } from "@/features/credentials/server/prefetch";
import {
  CredentialsError,
  CredentialsLoading,
} from "@/features/credentials/components/CredentialLIst";

type PageProps = {
  params: Promise<{ credentialId: string }>;
};

const CredentialIdPage = async ({ params }: PageProps) => {
  const { credentialId } = await params;

  prefetchcredential(credentialId);

  return (
    <div className="p-4 flex-1 flex flex-col gap-4">
      <Card className="w-full shadow-none flex-1">
        <CardHeader className="md:text-start text-center">
          <CardTitle>Edit Credential</CardTitle>
          <CardDescription>
            Update the API key details for this credential.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ErrorBoundary fallback={<CredentialsError />}>
            <Suspense fallback={<CredentialsLoading />}>
              <CredentialView />
            </Suspense>
          </ErrorBoundary>
        </CardContent>
      </Card>
    </div>
  );
};

export default CredentialIdPage;
