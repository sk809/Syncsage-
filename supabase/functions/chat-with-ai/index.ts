
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = "AIzaSyBSmfSJdkZ7-I0xsb4cyIE16vhBwNiW2FM";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    // Log the received messages for debugging
    console.log("Received messages:", messages);
    
    if (!GEMINI_API_KEY) {
      console.error("No API key found for Gemini");
      throw new Error("AI service configuration error: No API key found for Gemini");
    }

    console.log("Using Gemini API");
    
    // Format messages for Gemini API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role === "assistant" ? "model" : msg.role,
      parts: [{ text: msg.content }]
    }));
    
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: formattedMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });
    
    const geminiData = await response.json();
    console.log("Gemini response:", geminiData);
    
    if (geminiData.error) {
      console.error("Gemini API error:", geminiData.error);
      throw new Error(`Gemini API error: ${geminiData.error.message || JSON.stringify(geminiData.error)}`);
    }
    
    // Transform Gemini response to match OpenAI format expected by frontend
    const transformedResponse = {
      choices: [{
        message: {
          content: geminiData.candidates[0].content.parts[0].text,
          role: 'assistant'
        }
      }]
    };
    
    return new Response(
      JSON.stringify(transformedResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        choices: [{
          message: {
            content: "I'm sorry, I encountered an error processing your request. Please try again later.",
            role: "assistant"
          }
        }]
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
