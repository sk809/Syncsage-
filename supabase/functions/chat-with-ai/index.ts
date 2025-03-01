
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
    
    // Try OpenAI first, fallback to Gemini if not available
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!openAIApiKey && !geminiApiKey) {
      console.error("No API key found for AI service");
      return new Response(
        JSON.stringify({ 
          error: "AI service configuration error: No API key found for either OpenAI or Gemini" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    let response;
    
    // Use OpenAI if available
    if (openAIApiKey) {
      console.log("Using OpenAI API");
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages.map((msg: any) => ({
            role: msg.role,
            content: msg.content
          })),
          temperature: 0.7,
        }),
      });
      
      const data = await response.json();
      console.log("OpenAI response:", data);
      
      if (data.error) {
        throw new Error(`OpenAI API error: ${data.error.message || JSON.stringify(data.error)}`);
      }
      
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Fallback to Gemini if OpenAI is not available
    if (geminiApiKey) {
      console.log("Using Gemini API");
      // Format messages for Gemini API
      const formattedMessages = messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text: msg.content }]
      }));
      
      response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': geminiApiKey,
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
    }
    
    // This shouldn't happen since we check for API keys earlier
    throw new Error("No AI service available");
    
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
