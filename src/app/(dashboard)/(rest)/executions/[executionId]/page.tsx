import React from "react";

type PageProps = {
  params: Promise<{ executionId: string }>;
};

const ExecutionIdPage = async ({ params }: PageProps) => {
  const { executionId } = await params;

  return <div>executionId : {executionId}</div>;
};

export default ExecutionIdPage;
