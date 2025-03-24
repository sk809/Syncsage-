import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to clean CSS class name references from text content
export function cleanCssFromText(text: string): string {
  // Replace common CSS class patterns
  return text
    // Remove Tailwind-style class references like "text-gray-900" or "font-semibold"
    .replace(/\b(text|font|bg|border|p|m|flex|grid|gap|rounded|shadow|hover|focus)(-[a-zA-Z0-9]+)+\b/g, '')
    // Remove class attribute patterns
    .replace(/\bclass(Name)?="[^"]*"/g, '')
    // Remove style attributes
    .replace(/\bstyle="[^"]*"/g, '')
    // Remove lg: md: sm: prefix patterns
    .replace(/\b(lg|md|sm|xl|2xl):[a-zA-Z0-9-]+/g, '')
    // Replace any HTML tags with CSS class attributes 
    .replace(/<[^>]*class(Name)?=[^>]*>/g, (match) => {
      return match.replace(/class(Name)?="[^"]*"/g, '');
    })
    // Clean up extraneous spaces created by the replacements
    .replace(/\s{2,}/g, ' ')
    .trim();
}
