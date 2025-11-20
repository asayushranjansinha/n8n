import React from "react";

type PageProps = {
  params: Promise<{ workflowId: string }>;
};

const WorkflowIdPage = async ({ params }: PageProps) => {
  const { workflowId } = await params;

  return<div>workflowId : {workflowId}</div>;
};

export default WorkflowIdPage;
