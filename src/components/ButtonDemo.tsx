
import React, { useState } from "react";
import { AnimatedButton } from "@/components/ui/animated-button";
import { Card } from "@/components/ui/card";

export const ButtonDemo = () => {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [success, setSuccess] = useState<Record<string, boolean>>({});
  
  const handleClick = (buttonId: string) => {
    setLoading(prev => ({ ...prev, [buttonId]: true }));
    
    // Simulate API call
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [buttonId]: false }));
      setSuccess(prev => ({ ...prev, [buttonId]: true }));
      
      // Reset success state after showing it
      setTimeout(() => {
        setSuccess(prev => ({ ...prev, [buttonId]: false }));
      }, 1500);
    }, 1500);
  };
  
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Animated Button Showcase</h2>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card className="p-6 flex flex-col items-center justify-center gap-4">
          <h3 className="text-lg font-medium mb-2">Scale Animation</h3>
          <AnimatedButton 
            animation="scale"
            onClick={() => handleClick("scale")}
            isLoading={loading["scale"]}
            isSuccess={success["scale"]}
            className="w-40"
          >
            {success["scale"] ? "Success!" : "Scale"}
          </AnimatedButton>
          <p className="text-sm text-muted-foreground text-center">
            Smoothly scales on hover and click
          </p>
        </Card>
        
        <Card className="p-6 flex flex-col items-center justify-center gap-4">
          <h3 className="text-lg font-medium mb-2">Pulse Animation</h3>
          <AnimatedButton 
            animation="pulse"
            onClick={() => handleClick("pulse")}
            isLoading={loading["pulse"]}
            isSuccess={success["pulse"]}
            className="w-40"
          >
            {success["pulse"] ? "Success!" : "Pulse"}
          </AnimatedButton>
          <p className="text-sm text-muted-foreground text-center">
            Pulsing effect on hover
          </p>
        </Card>
        
        <Card className="p-6 flex flex-col items-center justify-center gap-4">
          <h3 className="text-lg font-medium mb-2">Shine Animation</h3>
          <AnimatedButton 
            animation="shine"
            onClick={() => handleClick("shine")}
            isLoading={loading["shine"]}
            isSuccess={success["shine"]}
            className="w-40"
          >
            {success["shine"] ? "Success!" : "Shine"}
          </AnimatedButton>
          <p className="text-sm text-muted-foreground text-center">
            Shimmering light effect on hover
          </p>
        </Card>
        
        <Card className="p-6 flex flex-col items-center justify-center gap-4">
          <h3 className="text-lg font-medium mb-2">Slide Animation</h3>
          <AnimatedButton 
            animation="slide"
            onClick={() => handleClick("slide")}
            isLoading={loading["slide"]}
            isSuccess={success["slide"]}
            className="w-40"
          >
            {success["slide"] ? "Success!" : "Slide"}
          </AnimatedButton>
          <p className="text-sm text-muted-foreground text-center">
            Sliding highlight effect on hover
          </p>
        </Card>
        
        <Card className="p-6 flex flex-col items-center justify-center gap-4 md:col-span-2">
          <h3 className="text-lg font-medium mb-2">Bounce Animation</h3>
          <AnimatedButton 
            animation="bounce"
            onClick={() => handleClick("bounce")}
            isLoading={loading["bounce"]}
            isSuccess={success["bounce"]}
            className="w-40"
          >
            {success["bounce"] ? "Success!" : "Bounce"}
          </AnimatedButton>
          <p className="text-sm text-muted-foreground text-center">
            Bouncy effect on hover
          </p>
        </Card>
      </div>
      
      <div className="mt-12 space-y-4">
        <h3 className="text-xl font-medium text-center">Usage Example</h3>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <pre className="text-sm overflow-x-auto">
            {`import { AnimatedButton } from "@/components/ui/animated-button";

// Basic usage
<AnimatedButton>Click Me</AnimatedButton>

// With animation variant
<AnimatedButton animation="shine">Shiny Button</AnimatedButton>

// Loading state
<AnimatedButton isLoading>Processing...</AnimatedButton>

// Success state
<AnimatedButton isSuccess>Completed!</AnimatedButton>`}
          </pre>
        </div>
      </div>
    </div>
  );
};
