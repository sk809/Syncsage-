
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function DemoVideoManager() {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const { data: demoVideo, isLoading } = useQuery({
    queryKey: ['demo-video'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('demo_videos')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('demo_videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('demo_videos')
        .insert({
          title: 'Platform Demo',
          description: 'Learn how to use our platform',
          file_path: filePath,
        });

      if (dbError) throw dbError;

      toast({
        title: "Upload successful",
        description: "Your demo video has been uploaded.",
      });

      // Refresh the page to show the new video
      window.location.reload();
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

  if (isLoading) {
    return <div className="flex justify-center p-8">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>;
  }

  return (
    <div className="space-y-4">
      {demoVideo ? (
        <video
          src={`${supabase.storage.from('demo_videos').getPublicUrl(demoVideo.file_path).data.publicUrl}`}
          controls
          className="w-full aspect-video rounded-lg shadow-lg transition-transform hover:scale-[1.02]"
        />
      ) : (
        <div className="relative">
          <Input
            type="file"
            onChange={handleVideoUpload}
            accept="video/*"
            disabled={uploading}
            className="hidden"
            id="video-upload"
          />
          <Button
            asChild
            disabled={uploading}
            className="w-full p-8 h-auto border-2 border-dashed"
          >
            <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-2">
              {uploading ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : (
                <>
                  <Upload className="h-8 w-8" />
                  <span>Upload Demo Video</span>
                </>
              )}
            </label>
          </Button>
        </div>
      )}
    </div>
  );
}
