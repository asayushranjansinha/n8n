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
  console.log("Executor START", { nodeId, data, context });

  const publishStatus = async (status: "loading" | "error" | "success") => {
    console.log("publishStatus()", { nodeId, status });
    await publish(httpRequestChannel().status({ nodeId, status }));
  };

  try {
    await publishStatus("loading");

    console.log("Validation STEP");
    if (!data.endpoint) {
      console.log("Validation FAILED -> endpoint missing");
      await publishStatus("error");
      throw new NonRetriableError("Http Request Node: No endpoint configured.");
    }

    if (!data.variableName) {
      console.log("Validation FAILED -> variableName missing");
      await publishStatus("error");
      throw new NonRetriableError(
        "Http Request Node: No variable name configured."
      );
    }

    if (!data.method) {
      console.log("Validation FAILED -> method missing");
      await publishStatus("error");
      throw new NonRetriableError("Http Request Node: No method configured.");
    }

    const variableName = data.variableName;
    console.log("Validation PASSED", { variableName });

    if (context[variableName]) {
      console.log("Validation FAILED -> context already contains variable");
      await publishStatus("error");
      throw new NonRetriableError(
        `Http Request Node: Variable name '${variableName}' already exists in context. Choose a different name.`
      );
    }

    console.log("Handlebars compile -> endpoint STEP");
    let endpoint = String(context[data.endpoint] ?? data.endpoint).trim();
    console.log("Initial endpoint value", { endpoint });

    try {
      // 1. Remove wrapping quotes if the string contains them
      if (
        (endpoint.startsWith('"') && endpoint.endsWith('"')) ||
        (endpoint.startsWith("'") && endpoint.endsWith("'"))
      ) {
        endpoint = endpoint.slice(1, -1).trim();
        console.log("Outer quotes stripped", { endpoint });
      }

      // 2. Remove wrapping backticks if present
      if (endpoint.startsWith("`") && endpoint.endsWith("`")) {
        endpoint = endpoint.slice(1, -1).trim();
        console.log("Backticks stripped", { endpoint });
      }

      // 3. If after stripping, it's still a key in context (bare lookup)
      const original = endpoint;
      if (!original.includes("{{") && original in context) {
        endpoint = String(context[original]).trim();
        console.log("Resolved as bare key from context", { endpoint });

        // Repeat cleanup on resolved value
        if (endpoint.startsWith("`") && endpoint.endsWith("`"))
          endpoint = endpoint.slice(1, -1).trim();
        if (
          (endpoint.startsWith('"') && endpoint.endsWith('"')) ||
          (endpoint.startsWith("'") && endpoint.endsWith("'"))
        ) {
          endpoint = endpoint.slice(1, -1).trim();
        }
        console.log("Cleaned resolved context value", { endpoint });
      }

      // 4. Finally compile via Handlebars (no harm if no templates inside)
      endpoint = Handlebars.compile(endpoint)(context).trim();
      console.log("Handlebars final compiled endpoint", { endpoint });

      // 5. Final guard
      if (!endpoint || typeof endpoint !== "string") {
        console.log("Final endpoint invalid");
        throw new NonRetriableError("HTTP Node: Endpoint resolution failed.");
      }
    } catch (e: any) {
      console.log("Handlebars FAILED -> endpoint", {
        message: e.message,
        stack: e.stack,
      });
      await publishStatus("error");
      throw new NonRetriableError(
        `HTTP Request node: Failed to resolve endpoint template: ${e.message}`
      );
    }

    console.log("Handlebars compile -> BODY STEP (if applicable)");
    let requestBody: string | undefined;
    if (["POST", "PUT", "PATCH"].includes(data.method)) {
      try {
        requestBody = Handlebars.compile(data.body || "{}")(context);
        console.log("Compiled body", { requestBody });

        JSON.parse(requestBody);
        console.log("Body JSON validated");
      } catch (e: any) {
        console.log("Body compile/JSON parse FAILED", {
          message: e.message,
          stack: e.stack,
        });
        await publishStatus("error");
        throw new NonRetriableError(
          `Http Request Node: Invalid JSON in request body. ${e.message}`
        );
      }
    }

    console.log("Executing HTTP step.run()");
    const updatedContext = await step.run("http-request", async () => {
      console.log("ky() request about to fire", {
        endpoint,
        method: data.method,
        requestBody,
      });

      const options: KyOptions = { method: data.method };

      if (requestBody) {
        options.body = requestBody;
        options.headers = { "Content-Type": "application/json" };
      }

      let res;
      try {
        res = await ky(endpoint, options);
        console.log("ky() RESPONSE received", {
          status: res.status,
          statusText: res.statusText,
        });
      } catch (err: any) {
        console.log("ky() REQUEST FAILED", {
          message: err.message,
          stack: err.stack,
        });
        throw err;
      }

      const contentType = res.headers.get("content-type") ?? "";
      let responseData;

      if (contentType.includes("application/json")) {
        const text = await res.text();
        try {
          responseData = JSON.parse(text);
          console.log("Parsed JSON response");
        } catch (e) {
          responseData = text;
          console.log("JSON parse failed, falling back to text");
        }
      } else {
        responseData = await res.text();
        console.log("Parsed text response");
      }

      const responsePayload = {
        httpResponse: {
          status: res.status,
          statusText: res.statusText,
          data: responseData,
        },
      };

      console.log("Returning updated context from HTTP run()");
      return { ...context, [data.variableName]: responsePayload };
    });

    console.log("Executor SUCCESS", {
      updatedContext: updatedContext[data.variableName],
    });
    await publishStatus("success");
    return updatedContext;
  } catch (error) {
    console.log("Executor OUTER CATCH", { error });
    await publishStatus("error");
    throw error;
  }
};
