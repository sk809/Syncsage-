// Direct integration with Google's Generative AI (Gemini API)

export interface Message {
  role: "user" | "assistant";
  content: string;
}

interface GeminiMessagePart {
  text: string;
}

interface GeminiMessage {
  role: string;
  parts: GeminiMessagePart[];
}

interface GeminiRequestBody {
  contents: GeminiMessage[];
  generationConfig: {
    temperature: number;
    top_p?: number;
    maxOutputTokens: number;
  };
}

interface GeminiResponseCandidate {
  content: {
    parts: {
      text: string;
    }[];
  };
}

interface GeminiResponse {
  candidates: GeminiResponseCandidate[];
  error?: {
    code: number;
    message: string;
    status: string;
  };
}

// Maximum number of retries for API calls
const MAX_RETRIES = 3;
// Delay between retries in milliseconds (starts at 1000ms and increases exponentially)
const INITIAL_RETRY_DELAY = 1000;

// List of model endpoints to try in order
const MODEL_ENDPOINTS = [
  // Primary models (current)
  'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent',
  'https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent',
  // Backup models (older)
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent'
];

// Used for type conversion between our app's message format and Gemini's
function convertToGeminiMessages(messages: Message[]): GeminiMessage[] {
  const systemMessage = "You are SageBot, an expert AI assistant specializing in content creation, marketing strategies, and social media. CRITICAL INSTRUCTION: YOU MUST NEVER RETURN HTML OR CSS IN YOUR RESPONSES. NEVER include ANY styling information or class names like 'font-semibold', 'text-gray-900', 'lg', etc. NEVER mention CSS classes like flex, grid, text-center, etc., even in explanatory text. Format using PLAIN TEXT ONLY with: '##' for headings, '-' for bullet points, numbers with dots for numbered lists, and '**' for bold text. Include emojis for engagement. Your formatted text will be processed separately. If you need to explain code, use pure markdown code formatting without any styling information.";
  
  // Initialize with system message
  const geminiMessages: GeminiMessage[] = [
    { role: "user", parts: [{ text: systemMessage }] },
    { role: "model", parts: [{ text: "I understand completely. I will only use plain text formatting with basic markdown symbols. No HTML, no CSS, and no class names will be included in my responses. I'll continue to use emojis to make content engaging. ✨" }] }
  ];
  
  // Add the rest of the messages
  for (const message of messages) {
    const geminiRole = message.role === "user" ? "user" : "model";
    geminiMessages.push({
      role: geminiRole,
      parts: [{ text: message.content }]
    });
  }
  
  return geminiMessages;
}

// Helper function to implement retry logic with exponential backoff
async function fetchWithRetry(url: string, options: RequestInit, retries = MAX_RETRIES, delay = INITIAL_RETRY_DELAY): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // Only retry on potentially recoverable errors (status >= 500, 429)
    if (!response.ok && (response.status >= 500 || response.status === 429) && retries > 0) {
      console.log(`Retrying after ${delay}ms, ${retries} attempts left. Status: ${response.status}`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    
    return response;
  } catch (error) {
    if (retries > 0) {
      console.log(`Network error, retrying after ${delay}ms, ${retries} attempts left.`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 2);
    }
    throw error;
  }
}

// The main function to chat with Gemini API
export async function chatWithGemini(messages: Message[], apiKey: string): Promise<string> {
  if (!apiKey) {
    console.error("No API key provided");
    return "API key is required. Please check your configuration.";
  }

  // Create a standard request body
  const requestBody: GeminiRequestBody = {
    contents: convertToGeminiMessages(messages),
    generationConfig: {
      temperature: 0.2, // Lower for more predictable responses
      top_p: 0.9,
      maxOutputTokens: 2048,
    }
  };

  // Log the start of the API call sequence
  console.log("Starting Gemini API call sequence with message length:", messages.length);
  
  // Try each model endpoint in sequence
  for (const endpoint of MODEL_ENDPOINTS) {
    try {
      console.log(`Attempting to use endpoint: ${endpoint}`);
      
      // Use the retry logic for fetch
      const response = await fetchWithRetry(
        `${endpoint}?key=${apiKey}`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        }
      );

      // If the API returns an error
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`Error with endpoint ${endpoint} (${response.status}):`, errorData);
        
        // If it's not a server error or rate limit, move to the next endpoint
        if (response.status !== 429 && response.status < 500) {
          console.log(`Endpoint ${endpoint} returned ${response.status}, trying next endpoint`);
          continue;
        }
        
        // Otherwise, this is likely a temporary issue, so we'll try again
        throw new Error(`API error: ${response.status} ${errorData}`);
      }

      // Parse the response
      const data = await response.json() as GeminiResponse;
      
      // Check for error in the response body (some errors come in the body rather than status)
      if (data.error) {
        console.error(`API response error with ${endpoint}:`, data.error);
        continue; // Try the next endpoint
      }
      
      // Check for valid candidates
      if (!data.candidates || data.candidates.length === 0) {
        console.warn(`No candidates in response from ${endpoint}:`, data);
        continue; // Try the next endpoint
      }
      
      // Success! Return the text from the first candidate
      const responseText = data.candidates[0]?.content?.parts?.[0]?.text;
      if (responseText) {
        console.log(`Successfully got response from ${endpoint}`);
        return responseText;
      } else {
        console.warn(`Received empty response from ${endpoint}`);
        continue;
      }
    } catch (error) {
      console.error(`Error with endpoint ${endpoint}:`, error);
      // Continue to the next endpoint
    }
  }

  // All endpoints failed, try one last simple request
  try {
    return await trySimplifiedRequest(messages, apiKey);
  } catch (finalError) {
    console.error("All API attempts failed:", finalError);
    return "I'm experiencing technical difficulties right now. Please try again in a moment.";
  }
}

// Final fallback with minimal parameters
async function trySimplifiedRequest(messages: Message[], apiKey: string): Promise<string> {
  console.log("Attempting simplified fallback request");
  try {
    // Get just the last user message to simplify the request
    let lastUserMessage = "Hello";
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserMessage = messages[i].content;
        break;
      }
    }
    
    // Try different endpoints with a minimal request
    for (const endpoint of MODEL_ENDPOINTS) {
      try {
        const minimalRequestBody = {
          contents: [
            {
              role: "user",
              parts: [{ text: lastUserMessage }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          }
        };
        
        console.log(`Trying simplified request to ${endpoint}`);
        const response = await fetch(`${endpoint}?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(minimalRequestBody),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Simplified request failed for ${endpoint} (${response.status}):`, errorText);
          continue;
        }

        const data = await response.json() as GeminiResponse;
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
          console.log(`Simplified request succeeded with ${endpoint}`);
          return `Sorry about the previous error. ${responseText}`;
        }
      } catch (error) {
        console.error(`Error with simplified request to ${endpoint}:`, error);
      }
    }
    
    throw new Error("All simplified requests failed");
  } catch (error) {
    console.error("Error with all simplified requests:", error);
    return "I'm sorry, I'm unable to respond right now. Please check your connection and try again in a few moments.";
  }
} 