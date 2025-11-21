import React from "react";

type PageProps = {
  params: Promise<{ credentialId: string }>;
};

const CredentialIdPage = async ({ params }: PageProps) => {
  const { credentialId } = await params;

  return <div>credentialId : {credentialId}</div>;
};

export default CredentialIdPage;
