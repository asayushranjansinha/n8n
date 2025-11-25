import { NextRequest, NextResponse } from "next/server";
import { sendWorkflowExecution } from "@/inngest/utils";

export async function POST(request: NextRequest) {
  try {
    console.log("[Stripe Webhook] Incoming request received");

    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      console.error("[Stripe Webhook] Missing query param: workflowId");
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: workflowId",
        },
        { status: 400 }
      );
    }

    console.log(`[Stripe Webhook] workflowId: ${workflowId}`);

    // Stripe POST body
    const body = await request.json();
    console.log("[Stripe Webhook] Raw event:", body);

    const stripeEvent = {
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode:body.livemode,
      raw: body.data.object,
    };

    console.log("[Stripe Webhook] Prepared stripeEvent:", stripeEvent);

    // Trigger Inngest workflow
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        stripe: stripeEvent,
      },
    });

    console.log("[Stripe Webhook] Workflow triggered successfully");

    // Stripe requires 2xx response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process Stripe event",
      },
      { status: 500 }
    );
  }
}
