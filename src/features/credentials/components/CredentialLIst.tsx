"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { formatDistanceToNow } from "date-fns";

import type { Credential } from "@/generated/prisma/client";
import { CredentialType } from "@/generated/prisma/enums";

import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "@/features/credentials/hooks/useCredentials";

import { EmptyEntity } from "@/components/entity/EmptyEntity";
import { EntityItem } from "@/components/entity/EntityItem";
import { EntityList } from "@/components/entity/EntityList";
import { ErrorView } from "@/components/entity/ErrorView";
import { LoadingView } from "@/components/entity/LoadingView";

export const CredentialList = () => {
  const { data } = useSuspenseCredentials();
  return (
    <EntityList
      items={data.items}
      getKey={(credential) => credential.id}
      emptyView={<CredentialEmpty />}
      renderItem={(credential) => <CredentialItem data={credential} />}
    />
  );
};

export const CredentialEmpty = () => {
  const router = useRouter();
  const handleCreateCredential = () => {
    router.push("/credentials/new");
  };
  return (
    <EmptyEntity
      onNew={handleCreateCredential}
      message="You haven't created any credentials yet, create one first to start working."
      title="No Credentials Found"
    />
  );
};

export const CredentialItem = ({
  data,
}: {
  data: Omit<Credential, "value">;
}) => {
  const removeCredential = useRemoveCredential();
  const handleCreateCredential = () => {
    removeCredential.mutate({ id: data.id });
  };
  return (
    <EntityItem
      href={`/credentials/${data.id}`}
      title={data.name}
      image={
        <div className="size-8 flex items-center justify-center ">
          <Image
            src={CredentialLogos[data.type]}
            alt={data.name}
            width={20}
            height={20}
          />
        </div>
      }
      isRemoving={removeCredential.isPending}
      onRemove={handleCreateCredential}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
    />
  );
};

export const CredentialsLoading = () => {
  return <LoadingView message="Loading Credentials..." />;
};
export const CredentialsError = () => {
  return <ErrorView message="Error Loading Credentials..." />;
};

const CredentialLogos: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/openai.svg",
  [CredentialType.GEMINI]: "/gemini.svg",
  [CredentialType.ANTHROPIC]: "/anthropic.svg",
};
