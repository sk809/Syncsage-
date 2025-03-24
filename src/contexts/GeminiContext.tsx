import { createContext, useContext, ReactNode } from "react";

// Updated with the new Gemini API key
const GEMINI_API_KEY = "AIzaSyDF8uZD2TpnXcjM_sAbQE6DIUr-Wfd49cA";

interface GeminiContextType {
  apiKey: string;
  hasValidKey: boolean;
}

const GeminiContext = createContext<GeminiContextType | undefined>(undefined);

export function GeminiProvider({ children }: { children: ReactNode }) {
  // Always use the hardcoded API key
  const apiKey = GEMINI_API_KEY;
  const hasValidKey = Boolean(apiKey);

  return (
    <GeminiContext.Provider value={{ apiKey, hasValidKey }}>
      {children}
    </GeminiContext.Provider>
  );
}

export function useGemini() {
  const context = useContext(GeminiContext);
  if (context === undefined) {
    throw new Error("useGemini must be used within a GeminiProvider");
  }
  return context;
} 