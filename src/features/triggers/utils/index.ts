export function createGoogleFormWebHookURL(workflowId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }
  return `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;
}

export function createStripeWebhookURL(workflowId: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
  }
  return `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;
}

export const generateGoogleFormScript = (
  webhookUrl: string
) => `function onFormSubmit(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();

  // Build responses object
  var responses = {};
  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    responses[itemResponse.getItem().getTitle()] = itemResponse.getResponse();
  }

  // Prepare webhook payload
  var payload = {
    formId: e.source.getId(),
    formTitle: e.source.getTitle(),
    responseId: formResponse.getId(),
    timestamp: formResponse.getTimestamp(),
    respondentEmail: formResponse.getRespondentEmail(),
    responses: responses
  };

  // Send to webhook
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  var WEBHOOK_URL = '${webhookUrl}';

  try {
    UrlFetchApp.fetch(WEBHOOK_URL, options);
  } catch(error) {
    console.error('Webhook failed:', error);
  }
}`;
