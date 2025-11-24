import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

export type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  context,
  step,
}) => {
  if (!data.endpoint) {
    throw new NonRetriableError("Http Request Node: No endpoint configured.");
  }

  if (!data.variableName) {
    throw new NonRetriableError(
      "Http Request Node: No variable name configured."
    );
  }

  if (!data.method) {
    throw new NonRetriableError("Http Request Node: No method configured.");
  }

  const variableName = data.variableName; // now TypeScript knows it's a string

  const updatedContext = await step.run("http-request", async () => {
    const options: KyOptions = { method: data.method };

    if (["POST", "PUT", "PATCH"].includes(data.method)) {
      options.body = data.body;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    const res = await ky(data.endpoint!, options);
    const contentType = res.headers.get("content-type") ?? "";

    const responseData = contentType.includes("application/json")
      ? await res.json().catch(() => res.text())
      : await res.text();

    const responsePayload = {
      httpResponse: {
        status: res.status,
        statusText: res.statusText,
        data: responseData,
      },
    };

    return {
      ...context,
      [variableName]: responsePayload,
    };
  });

  return updatedContext;
};
