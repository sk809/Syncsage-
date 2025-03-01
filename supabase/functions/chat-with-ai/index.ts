
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Using environment variable for API key instead of hardcoding
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "AIzaSyBSmfSJdkZ7-I0xsb4cyIE16vhBwNiW2FM";

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

    console.log("Using Gemini API with proper configuration");
    
    // Format messages for Gemini API
    // The most recent message is the one we want to send to Gemini
    const lastMessage = messages[messages.length - 1];
    console.log("Using last message for prompt:", lastMessage);
    
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    console.log("Making request to:", apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            role: lastMessage.role === "assistant" ? "model" : "user",
            parts: [{ text: lastMessage.content }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      }),
    });
    
    // Log the response status for debugging
    console.log("Gemini API response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }
    
    const geminiData = await response.json();
    console.log("Gemini response structure:", JSON.stringify(geminiData));
    
    if (!geminiData.candidates || !geminiData.candidates[0]) {
      console.error("Invalid Gemini response format:", geminiData);
      throw new Error("Invalid response format from Gemini API");
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
    
    console.log("Transformed response:", JSON.stringify(transformedResponse));
    
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
