import { NextRequest, NextResponse } from "next/server";

import { sendWorkflowExecution } from "@/inngest/utils";

export async function POST(request: NextRequest) {
  try {
    console.log("[Google Form Webhook] Incoming request received");

    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      console.error(
        "[Google Form Webhook] Missing required query parameter: workflowId"
      );
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: workflowId",
        },
        { status: 400 }
      );
    }

    console.log(`[Google Form Webhook] workflowId: ${workflowId}`);

    const body = await request.json();
    console.log("[Google Form Webhook] Request body:", body);

    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondedEmail: body.respondedEmail,
      responses: body.responses,
      raw: body,
    };

    console.log("[Google Form Webhook] Prepared formData:", formData);

    // Trigger an inngest job
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        googleForm: formData,
      },
    });

    console.log(
      "[Google Form Webhook] Workflow execution triggered successfully"
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Google Form Webhook] Error processing request:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process Google Form submission",
      },
      { status: 500 }
    );
  }
}
