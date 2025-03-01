
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    // Log the received messages for debugging
    console.log("Received messages:", messages);
    
    // If no API key is available, return a helpful error
    const apiKey = Deno.env.get('OPENAI_API_KEY') || Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      console.error("No API key found for AI service");
      return new Response(
        JSON.stringify({ 
          error: "AI service configuration error: API key not found" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // For this implementation, we'll use a simple mock response
    // This ensures the function works even without external API calls
    // Later you can replace this with actual API calls to OpenAI, Google Gemini, etc.
    
    // Find the last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    let responseContent = "I'm Sage Bot, your AI content assistant. I'm here to help with content creation, analytics, and strategy!";
    
    if (lastUserMessage) {
      if (lastUserMessage.content.toLowerCase().includes("who are you")) {
        responseContent = "I'm Sage Bot, your AI content assistant. I help content creators with ideation, strategy, and analytics to boost your creative workflow!";
      } else if (lastUserMessage.content.toLowerCase().includes("hello") || 
                lastUserMessage.content.toLowerCase().includes("hi")) {
        responseContent = "Hello there! I'm Sage Bot. How can I assist with your content creation today?";
      } else {
        responseContent = "I'm here to help with your content needs. Could you provide more details about what you're looking for?";
      }
    }
    
    // Format response to match expected structure
    const response = {
      choices: [{
        message: {
          content: responseContent,
          role: 'assistant'
        }
      }]
    };

    console.log("Sending response:", response);
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
