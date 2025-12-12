"use client";

import { format, intervalToDuration } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle2Icon,
  ClockIcon,
  Play,
  XCircleIcon,
} from "lucide-react";
import { useParams } from "next/navigation";
import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useSuspenseExecution } from "@/features/executions/hooks/useExecutions";
import { Execution } from "@/generated/prisma";
import { ExecutionStatus } from "@/generated/prisma";
import { cn } from "@/lib/utils";

const statusConfig = {
  [ExecutionStatus.RUNNING]: {
    icon: ClockIcon,
    label: "Running",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  [ExecutionStatus.COMPLETED]: {
    icon: CheckCircle2Icon,
    label: "Completed",
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
  },
  [ExecutionStatus.FAILED]: {
    icon: XCircleIcon,
    label: "Failed",
    color: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
  },
};

export const ExecutionView = () => {
  const params = useParams();
  const executionId = params.executionId as string;
  const { data: execution } = useSuspenseExecution(executionId) as {
    data: Execution;
  };

  // Correct duration calc (HH:mm:ss)
  const duration = execution.completedAt
    ? (() => {
        const d = intervalToDuration({
          start: execution.startedAt,
          end: execution.completedAt,
        });
        const hours = String(d.hours ?? 0).padStart(2, "0");
        const minutes = String(d.minutes ?? 0).padStart(2, "0");
        const seconds = String(d.seconds ?? 0).padStart(2, "0");
        return `${hours}:${minutes}:${seconds}`;
      })()
    : "Not completed";

  return (
    <div className="mx-auto space-y-5 w-full">
      <StatusPanel execution={execution.status} executionId={execution.id}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <InfoCard
            icon={Play}
            label="Workflow ID"
            value={execution.workflowId}
            iconColour="text-purple-600"
          />
          <InfoCard
            icon={Calendar}
            label="Started At"
            value={format(execution.startedAt, "PPP pp")}
            iconColour="text-blue-600"
          />
          <InfoCard
            icon={ClockIcon}
            label="Duration"
            value={duration}
            iconColour="text-orange-600"
          />
          <InfoCard
            icon={Calendar}
            label="Completed At"
            value={
              execution.completedAt
                ? format(execution.completedAt, "PPP pp")
                : "Not completed"
            }
            iconColour="text-green-600"
          />
          <InfoCard
            icon={Play}
            label="Inngest Event ID"
            value={execution.inngestEventId}
            iconColour="text-indigo-600"
          />
          <InfoCard
            icon={AlertCircle}
            label="Status"
            value={execution.status}
          />
        </div>
      </StatusPanel>

      {/* Output Accordion */}
      {(execution.output || execution.error || execution.errorStack) && (
        <Accordion type="single" collapsible defaultValue="results">
          <AccordionItem value="results">
            <AccordionTrigger
              className={cn(statusConfig[execution.status].color)}
            >
              Results
            </AccordionTrigger>

            <AccordionContent className="bg-secondary p-3 space-y-3 rounded-lg">
              {execution.output && (
                <pre className="whitespace-pre-wrap wrap-break-words text-xs text-secondary-foreground overflow-x-auto">
                  <strong className={statusConfig[execution.status].color}>
                    Output:
                  </strong>
                  <br />
                  {JSON.stringify(execution.output, null, 2)}
                </pre>
              )}

              {execution.error && (
                <pre className="whitespace-pre-wrap wrap-break-words text-xs text-secondary-foreground overflow-x-auto">
                  <strong className="text-red-600">Error:</strong>
                  <br />
                  {JSON.stringify(execution.error, null, 2)}
                </pre>
              )}

              {execution.errorStack && (
                <pre className="whitespace-pre-wrap wrap-break-words text-xs text-secondary-foreground overflow-x-auto">
                  <strong className="text-red-600">Stack:</strong>
                  <br />
                  {JSON.stringify(execution.errorStack, null, 2)}
                </pre>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </div>
  );
};

type StatusPanelProps = {
  execution: ExecutionStatus;
  executionId: string;
  children?: React.ReactNode;
};

const StatusPanel = ({
  execution,
  executionId,
  children,
}: StatusPanelProps) => {
  const config = statusConfig[execution];
  const Icon = config.icon;

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-semibold ${config.color}`}>
          {config.label}
        </h2>
        <span className={`text-xs font-mono opacity-60 ${config.color}`}>
          {executionId}
        </span>
      </div>
      {children}
    </>
  );
};

type InfoCardProps = {
  icon: React.ElementType;
  label: string;
  value: string;
  iconColour?: string;
};

export const InfoCard = ({
  icon: Icon,
  label,
  value,
  iconColour = "text-gray-600",
}: InfoCardProps) => {
  return (
    <div className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className={`mt-1 ${iconColour}`}>
        <Icon className="w-4.5 h-4.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-500 mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900 wrap-break-words">
          {value}
        </p>
      </div>
    </div>
  );
};
