import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";

import type { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "@/inngest/channels/http-request";

export type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: string;
};

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: "loading" | "error" | "success") => {
    await publish(
      httpRequestChannel().status({
        nodeId,
        status,
      })
    );
  };

  try {
    await publishStatus("loading");

    // Validation checks
    if (!data.endpoint) {
      await publishStatus("error");
      throw new NonRetriableError("Http Request Node: No endpoint configured.");
    }

    if (!data.variableName) {
      await publishStatus("error");
      throw new NonRetriableError(
        "Http Request Node: No variable name configured."
      );
    }

    if (!data.method) {
      await publishStatus("error");
      throw new NonRetriableError("Http Request Node: No method configured.");
    }

    const variableName = data.variableName;

    if (context[variableName]) {
      await publishStatus("error");
      throw new NonRetriableError(
        `Http Request Node: Variable name '${variableName}' already exists in context. Choose a different name.`
      );
    }

    // Pre-compile and validate endpoint template
    let endpoint: string;
    try {
      const template = Handlebars.compile(data.endpoint);
      endpoint = template(context);

      if (!endpoint || typeof endpoint !== "string") {
        throw new Error("Endpoint template must resolve to a non-empty string");
      }
    } catch (e: any) {
      await publishStatus("error");
      throw new NonRetriableError(
        `HTTP Request node: Failed to resolve endpoint template: ${e.message}`
      );
    }

    // Pre-validate JSON body for POST/PUT/PATCH requests
    let requestBody: string | undefined;
    if (["POST", "PUT", "PATCH"].includes(data.method)) {
      try {
        const resolved = Handlebars.compile(data.body || "{}")(context);
        JSON.parse(resolved); // Validate it's valid JSON
        requestBody = resolved;
      } catch (error) {
        await publishStatus("error");
        throw new NonRetriableError(
          `Http Request Node: Invalid JSON in request body. ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }

    // Now execute the actual HTTP request in a step
    const updatedContext = await step.run("http-request", async () => {
      const options: KyOptions = { method: data.method };

      if (requestBody) {
        options.body = requestBody;
        options.headers = {
          "Content-Type": "application/json",
        };
      }

      const res = await ky(endpoint, options);

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

    await publishStatus("success");
    return updatedContext;
  } catch (error) {
    await publishStatus("error");
    throw error;
  }
};
