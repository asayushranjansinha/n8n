"use client";

import { useParams } from "next/navigation";
import { CredentialsForm } from "./CredentialsForm";

import { useSuspenseCredential } from "../hooks/useCredentials";

export const CredentialView = () => {
  const params = useParams();
  const credentialId = params.credentialId as string;

  const { data: credential } = useSuspenseCredential(credentialId);
  return <CredentialsForm initialData ={credential} />;
};
