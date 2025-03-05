
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Using environment variable for API key
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
      throw new Error("AI service configuration error: No API key found. Please set GEMINI_API_KEY in your Supabase Edge Function secrets.");
    }

    console.log("Using Gemini API with proper configuration");
    
    // Create a prompt based on SageBot's specializations
    const systemMessage = "You are SageBot, an expert AI assistant specializing in content creation, marketing strategies, and social media. You help users generate creative content ideas, viral hooks, trending hashtags, and detailed content strategies. Always provide well-structured, practical advice and creative suggestions. Format your responses with clear headings, bullet points for lists, and keep your tone helpful and encouraging.";
    
    // Since Gemini doesn't have a direct "system" message concept, we'll add it to the conversation
    const geminiPrompt = [
      { role: "user", parts: [{ text: systemMessage }] },
      { role: "model", parts: [{ text: "I understand. I'll act as SageBot, providing expert advice on content creation, marketing strategies, and social media with well-structured responses." }] }
    ];
    
    // Add user messages
    for (const message of messages) {
      if (message.role === "user") {
        geminiPrompt.push({
          role: "user",
          parts: [{ text: message.content }]
        });
      } else if (message.role === "assistant") {
        geminiPrompt.push({
          role: "model",
          parts: [{ text: message.content }]
        });
      }
    }
    
    const apiUrl = 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent';
    console.log("Making request to:", apiUrl);
    
    const response = await fetch(`${apiUrl}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: geminiPrompt,
        generationConfig: {
          temperature: 0.7,
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
    
    // Extract the response content from Gemini
    const generatedContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
    
    // Transform Gemini response to match expected format by frontend
    const transformedResponse = {
      choices: [{
        message: {
          role: "assistant",
          content: generatedContent
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
