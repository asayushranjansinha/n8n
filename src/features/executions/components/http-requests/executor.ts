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
  return new Handlebars.SafeString(JSON.stringify(context, null, 2));
});

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  const publishStatus = async (status: "loading" | "error" | "success") => {
    await publish(httpRequestChannel().status({ nodeId, status }));
  };

  try {
    await publishStatus("loading");

    if (!data.endpoint) {
      await publishStatus("error");
      throw new NonRetriableError("Http Request Node: No endpoint configured.");
    }

    if (!data.variableName) {
      await publishStatus("error");
      throw new NonRetriableError("Http Request Node: No variable name configured.");
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

    let endpoint = String(context[data.endpoint] ?? data.endpoint).trim();

    try {
      if ((endpoint.startsWith('"') && endpoint.endsWith('"')) || (endpoint.startsWith("'") && endpoint.endsWith("'"))) {
        endpoint = endpoint.slice(1, -1).trim();
      }

      if (endpoint.startsWith("`") && endpoint.endsWith("`")) {
        endpoint = endpoint.slice(1, -1).trim();
      }

      const original = endpoint;
      if (!original.includes("{{") && original in context) {
        endpoint = String(context[original]).trim();

        if (endpoint.startsWith("`") && endpoint.endsWith("`")) endpoint = endpoint.slice(1, -1).trim();
        if ((endpoint.startsWith('"') && endpoint.endsWith('"')) || (endpoint.startsWith("'") && endpoint.endsWith("'"))) {
          endpoint = endpoint.slice(1, -1).trim();
        }
      }

      endpoint = Handlebars.compile(endpoint)(context).trim();

      if (!endpoint || typeof endpoint !== "string") {
        throw new NonRetriableError("HTTP Node: Endpoint resolution failed.");
      }
    } catch (e: any) {
      await publishStatus("error");
      throw new NonRetriableError(`HTTP Request node: Failed to resolve endpoint template: ${e.message}`);
    }

    let requestBody: string | undefined;
    if (["POST", "PUT", "PATCH"].includes(data.method)) {
      try {
        requestBody = Handlebars.compile(data.body || "{}")(context);
        JSON.parse(requestBody);
      } catch (e: any) {
        await publishStatus("error");
        throw new NonRetriableError(`Http Request Node: Invalid JSON in request body. ${e.message}`);
      }
    }

    const updatedContext = await step.run("http-request", async () => {
      const options: KyOptions = { method: data.method };

      if (requestBody) {
        options.body = requestBody;
        options.headers = { "Content-Type": "application/json" };
      }

      const res = await ky(endpoint, options);
      const contentType = res.headers.get("content-type") ?? "";
      let responseData;

      if (contentType.includes("application/json")) {
        const text = await res.text();
        try {
          responseData = JSON.parse(text);
        } catch {
          responseData = text;
        }
      } else {
        responseData = await res.text();
      }

      return { ...context, [data.variableName]: { httpResponse: { status: res.status, statusText: res.statusText, data: responseData } } };
    });

    await publishStatus("success");
    return updatedContext;
  } catch (error) {
    await publishStatus("error");
    throw error;
  }
};
