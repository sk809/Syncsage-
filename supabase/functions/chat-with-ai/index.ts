
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Using environment variable for API key with fallback
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Received request in chat-with-ai function");
    const requestData = await req.json();
    const { messages } = requestData;

    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid request format:", requestData);
      throw new Error("Invalid request: messages array is required");
    }

    console.log("Processing request with messages:", JSON.stringify(messages));

    if (!OPENAI_API_KEY) {
      console.error("Missing OpenAI API key");
      throw new Error("AI service configuration error: No API key found. Please set OPENAI_API_KEY in your Supabase Edge Function secrets.");
    }

    console.log("Using OpenAI API with proper configuration");
    
    // Create a prompt based on SageBot's specializations
    const systemMessage = "You are SageBot, an expert AI assistant specializing in content creation, marketing strategies, and social media. You help users generate creative content ideas, viral hooks, trending hashtags, and detailed content strategies. Always provide well-structured, practical advice and creative suggestions. Format your responses with clear headings, bullet points for lists, and keep your tone helpful and encouraging.";
    
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    console.log("Making request to:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemMessage },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
    });
    
    // Log the response status for debugging
    console.log("OpenAI API response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }
    
    const openaiData = await response.json();
    console.log("OpenAI response structure:", JSON.stringify(openaiData));
    
    // Transform OpenAI response to match expected format by frontend
    const transformedResponse = {
      choices: [{
        message: {
          role: "assistant",
          content: openaiData.choices[0].message.content
        }
      }]
    };
    
    console.log("Transformed response for frontend:", JSON.stringify(transformedResponse));
    
    return new Response(
      JSON.stringify(transformedResponse),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Unknown error processing your request",
        success: false
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
