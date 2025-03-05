
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Using environment variable for API key with fallback
const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY") || "";

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

    if (!GEMINI_API_KEY) {
      console.error("Missing Gemini API key");
      throw new Error("AI service configuration error: No API key found for Gemini. Please set GEMINI_API_KEY in your Supabase Edge Function secrets.");
    }

    console.log("Using Gemini API with proper configuration");
    console.log("GEMINI_API_KEY:", GEMINI_API_KEY ? "Loaded" : "Not Found");
    
    // For Gemini API we'll combine all user messages into one context for better continuity
    let combinedPrompt = "You are SageBot, an expert AI assistant specializing in content creation, marketing strategies, and social media. You help users generate creative content ideas, viral hooks, trending hashtags, and detailed content strategies. Always provide well-structured, practical advice and creative suggestions. Format your responses with clear headings, bullet points for lists, and keep your tone helpful and encouraging.\n\n";
    
    // Add conversation history for context
    messages.forEach((msg, index) => {
      if (index < messages.length - 1) { // All but the last message
        combinedPrompt += `${msg.role === "assistant" ? "You" : "User"}: ${msg.content}\n\n`;
      }
    });
    
    // Add the actual question
    const lastMessage = messages[messages.length - 1];
    combinedPrompt += `User's request: ${lastMessage.content}\n\nYour response:`;
    
    console.log("Combined prompt:", combinedPrompt);
    
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
            parts: [{ text: combinedPrompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 4096,
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
    
    // Extract the generated text
    const generatedText = geminiData.candidates[0].content.parts[0].text;
    
    // Transform Gemini response to match OpenAI format expected by frontend
    const transformedResponse = {
      choices: [{
        message: {
          role: "assistant",
          content: generatedText
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
