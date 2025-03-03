
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export interface AnimatedButtonProps extends ButtonProps {
  /**
   * The animation variant to apply to the button
   * @default "scale"
   */
  animation?: "scale" | "pulse" | "shine" | "slide" | "bounce";
  
  /**
   * Whether to show a loading spinner
   */
  isLoading?: boolean;
  
  /**
   * Whether the button is in a success state
   */
  isSuccess?: boolean;
}

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    children, 
    animation = "scale",
    isLoading = false,
    isSuccess = false,
    disabled,
    ...props 
  }, ref) => {
    // Determine animation classes based on the animation prop
    const animationClasses = React.useMemo(() => {
      switch(animation) {
        case "pulse":
          return "hover:animate-pulse transition-all duration-300";
        case "shine":
          return "overflow-hidden relative hover:before:opacity-100 before:absolute before:content-[''] before:opacity-0 before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:transform before:-skew-x-12 before:animate-[shine_1.5s_ease_infinite] transition-all duration-300";
        case "slide":
          return "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-500 transition-all duration-300";
        case "bounce":
          return "hover:animate-[bounce_0.5s_ease-in-out] transition-all duration-300";
        case "scale":
        default:
          return "hover:scale-105 active:scale-95 transition-transform duration-200";
      }
    }, [animation]);
    
    // Combine all classes
    const buttonClasses = cn(
      animationClasses,
      isLoading ? "cursor-wait" : "",
      isSuccess ? "bg-success hover:bg-success/90" : "",
      className
    );
    
    // Handle loading and success states
    const content = React.useMemo(() => {
      if (isLoading) {
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        );
      }
      
      return children;
    }, [isLoading, children]);
    
    return (
      <Button
        className={buttonClasses}
        disabled={isLoading || disabled || isSuccess}
        ref={ref}
        {...props}
      >
        {content}
      </Button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";
