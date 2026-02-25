import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { query } = await req.json();
    if (!query) throw new Error("Search query is required");

    const appId = Deno.env.get("EDAMAM_APP_ID");
    const appKey = Deno.env.get("EDAMAM_APP_KEY");

    if (!appId || !appKey) {
      throw new Error("Missing Edamam keys in Supabase Secrets");
    }

    // Call Edamam Food Database Parser
    // nutrition-type=logging is best for fitness apps
    const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${appId}&app_key=${appKey}&ingr=${encodeURIComponent(query)}&nutrition-type=logging`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Edamam error: ${response.statusText}`);

    const data = await response.json();

    // Map Edamam 'hints' to your Widget's interface
    const foods = (data.hints || []).map((hit: any) => {
      const f = hit.food;
      const nutrients = f.nutrients || {};

      return {
        id: `edam-${f.foodId}`,
        meal_name: f.label?.toUpperCase() || "UNKNOWN",
        brand: f.brand || "Generic",
        // Nutrients are returned per 100g by Edamam
        calories: Math.round(nutrients.ENERC_KCAL || 0),
        protein_g: parseFloat((nutrients.PROCNT || 0).toFixed(1)),
        carbs_g: parseFloat((nutrients.CHOCDF || 0).toFixed(1)),
        fats_g: parseFloat((nutrients.FAT || 0).toFixed(1)),
        serving: "100g" 
      };
    });

    return new Response(JSON.stringify({ foods }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message, foods: [] }), { 
      headers: corsHeaders 
    });
  }
});