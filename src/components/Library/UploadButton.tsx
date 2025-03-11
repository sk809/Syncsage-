
import { useState } from "react";
import { Plus, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UploadButtonProps {
  label?: string;
  icon?: React.ReactNode;
  acceptTypes?: string;
  buttonVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "success";
  onUploadComplete?: (filePath: string) => void;
}

export function UploadButton({ 
  label = "Upload Media", 
  icon = <Plus className="mr-2 h-4 w-4" />, 
  acceptTypes = "image/*,video/*",
  buttonVariant = "default",
  onUploadComplete
}: UploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('media_files')
        .insert({
          filename: file.name,
          file_path: filePath,
          content_type: file.type,
          type: fileType,
          size: file.size,
          user_id: user.id,
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['media-files'] });
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded to the library.",
      });
      
      // Call the callback with the file path if provided
      if (onUploadComplete) {
        const publicUrl = supabase.storage.from('media').getPublicUrl(filePath).data.publicUrl;
        onUploadComplete(publicUrl);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <Input
        type="file"
        onChange={handleFileUpload}
        accept={acceptTypes}
        disabled={uploading}
        className="hidden"
        id={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`}
      />
      <Button
        asChild
        disabled={uploading}
        variant={buttonVariant}
      >
        <label htmlFor={`file-upload-${label.replace(/\s+/g, '-').toLowerCase()}`} className="cursor-pointer">
          {uploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            icon
          )}
          {label}
        </label>
      </Button>
    </div>
  );
}
