
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1";

const SUPABASE_URL = "https://mmcmimmzgvovmvnbsznv.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, purchaseId, userId, tier } = await req.json();

    if (!productId || !userId || !tier) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Standard plan product ID: 7CX2FTDAsPXnb5Z-9bRKRA==
    // Pro plan product ID: 7CX2FTDAsPXnb5Z-9bRKRA==
    // For demo purposes, we're just checking if the productId matches what we expect
    // In a real app, you would make an API call to Gumroad to verify the purchase
    const validProductIds = {
      standard: "7CX2FTDAsPXnb5Z-9bRKRA==",
      pro: "7CX2FTDAsPXnb5Z-9bRKRA==",
    };

    // Check if the product ID is valid for the given tier
    if (validProductIds[tier] !== productId) {
      return new Response(
        JSON.stringify({ error: "Invalid product ID for the given tier" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create a Supabase client with the service role key
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Calculate expiration date based on plan tier
    let expiresAt;
    if (tier === "standard") {
      // Standard plan: 1 month
      expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    } else if (tier === "pro") {
      // Pro plan: 1 year
      expiresAt = new Date();
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    }

    console.log(`Updating subscription for user ${userId} to tier ${tier} with expiry ${expiresAt}`);

    // Update user subscription
    const { data, error } = await supabase
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        tier: tier,
        starts_at: new Date().toISOString(),
        expires_at: expiresAt?.toISOString(),
        gumroad_product_id: productId,
        gumroad_purchase_id: purchaseId,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error("Error updating subscription:", error);
      return new Response(
        JSON.stringify({ error: "Failed to update subscription" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Subscription updated successfully:", data);

    return new Response(
      JSON.stringify({ 
        message: "Subscription updated successfully",
        subscription: data[0]
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
