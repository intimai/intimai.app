import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface Payload {
  data: any;
  user: any;
}

interface WebhookBody {
  webhookType: "CRIACAO" | "REATIVACAO" | "CANCELAMENTO" | "SUPORTE";
  payload: Payload;
}

serve(async (req) => {
  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body: WebhookBody = await req.json();
    const { webhookType, payload } = body;

    let webhookUrl: string | undefined;

    // Determine the webhook URL based on the type
    switch (webhookType) {
      case "CRIACAO":
        webhookUrl = Deno.env.get("WEBHOOK_CRIACAO_URL");
        break;
      case "REATIVACAO":
        webhookUrl = Deno.env.get("WEBHOOK_REATIVACAO_URL");
        break;
      case "CANCELAMENTO":
        webhookUrl = Deno.env.get("WEBHOOK_CANCELAMENTO_URL");
        break;
      case "SUPORTE":
        webhookUrl = Deno.env.get("WEBHOOK_SUPORTE_URL");
        break;
      default:
        return new Response(JSON.stringify({ error: "Invalid webhook type" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    if (!webhookUrl) {
      return new Response(JSON.stringify({ error: `Webhook URL for type ${webhookType} not configured` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Forward the request to the appropriate webhook URL
    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload), // Correctly use the payload object
    });

    if (!webhookResponse.ok) {
      const errorBody = await webhookResponse.text();
      return new Response(JSON.stringify({ error: `Failed to forward webhook for ${webhookType}` }), {
        status: 502, // Bad Gateway
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});