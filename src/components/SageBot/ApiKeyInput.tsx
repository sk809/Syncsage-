import { useState } from "react";
import { useGemini } from "@/contexts/GeminiContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, Save, Check, AlertCircle } from "lucide-react";

export const ApiKeyInput = () => {
  const { apiKey, setApiKey, hasValidKey } = useGemini();
  const [inputKey, setInputKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveKey = () => {
    setApiKey(inputKey.trim());
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <KeyRound className="w-5 h-5" />
          Gemini API Key
        </CardTitle>
        <CardDescription>
          Enter your Google Gemini API key to enable the AI chat functionality
        </CardDescription>
      </CardHeader>
      <CardContent>
        {hasValidKey && (
          <Alert className="mb-4 bg-green-50 border-green-200">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700">
              API key is set and ready to use
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="relative">
            <Input 
              type={showKey ? "text" : "password"}
              placeholder="Enter your Gemini API key..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="pr-32"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-1 top-1 h-8 rounded-sm px-2 text-xs"
            >
              {showKey ? "Hide" : "Show"}
            </Button>
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              <a 
                href="https://ai.google.dev/tutorials/setup" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                Need an API key?
              </a>
            </div>
            <Button
              onClick={handleSaveKey} 
              disabled={!inputKey.trim()}
              size="sm"
            >
              {isSaved ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Key
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 