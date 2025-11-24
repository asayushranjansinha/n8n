import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import Handlebars from "handlebars";

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

  const variableName = data.variableName;

  if (context[variableName]) {
    throw new NonRetriableError(
      `Http Request Node: Variable name '${variableName}' already exists in context. Choose a different name.`
    );
  }

  const updatedContext = await step.run("http-request", async () => {
    // Compile endpoint with context (allows templates like {{previousNode.data}})

    let endpoint: string;

    try {
      const template = Handlebars.compile(data.endpoint);
      endpoint = template(context);

      if (!endpoint || typeof endpoint !== "string") {
        throw new Error("Endpoint template must resolve to a non-empty string");
      }
    } catch (e: any) {
      throw new NonRetriableError(
        `HTTP Request node: Failed to resolve endpoint template: ${e.message}`
      );
    }

    const options: KyOptions = { method: data.method };

    if (["POST", "PUT", "PATCH"].includes(data.method)) {
      const resolved = Handlebars.compile(data.body || "{}")(context);
      // Validate JSON before sending
      try {
        JSON.parse(resolved);
      } catch (error) {
        throw new NonRetriableError(
          `Http Request Node: Invalid JSON in request body. ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
      options.body = resolved;
      options.headers = {
        "Content-Type": "application/json",
      };
    }

    // Use the compiled endpoint, not the raw one
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

    // Return context with new variable so next node can access it
    return {
      ...context,
      [variableName]: responsePayload,
    };
  });

  return updatedContext;
};
