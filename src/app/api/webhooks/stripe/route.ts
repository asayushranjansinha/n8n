import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { sendWorkflowExecution } from "@/inngest/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

// Required for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

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

    // Read raw body
    const rawBody = await request.text();
    const signature = request.headers.get("stripe-signature")!;

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error(
        "[Stripe Webhook] Signature verification failed:",
        err.message
      );
      return NextResponse.json(
        { success: false, error: "Invalid Stripe signature" },
        { status: 400 }
      );
    }

    console.log("[Stripe Webhook] Verified event:", event.type);

    const stripeEvent = {
      eventId: event.id,
      eventType: event.type,
      timestamp: event.created,
      livemode: event.livemode,
      raw: event.data.object,
    };

    await sendWorkflowExecution({
      workflowId,
      initialData: {
        stripe: stripeEvent,
      },
    });

    console.log("[Stripe Webhook] Workflow triggered successfully");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Stripe Webhook] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Stripe event" },
      { status: 500 }
    );
  }
}
