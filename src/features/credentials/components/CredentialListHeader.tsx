import { EntityHeader } from "@/components/entity/EntityHeader";

export const CredentialListHeader = ({ disabled }: { disabled?: boolean }) => {
  return (
    <EntityHeader
      title="Credentials"
      description="Create and manage your credentials"
      newButtonHref="/credentials/new"
      newButtonLabel="New Credential"
      disabled={disabled}
    />
  );
};
