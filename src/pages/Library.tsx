
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Loader2, Image as ImageIcon, Video, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

interface MediaFile {
  id: string;
  filename: string;
  file_path: string;
  content_type: string;
  created_at: string;
  description: string | null;
  type: 'image' | 'video';
  size: number;
}

const Library = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: mediaFiles, isLoading } = useQuery({
    queryKey: ['media-files'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('media_files')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MediaFile[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const fileToDelete = mediaFiles?.find(f => f.id === id);
      if (!fileToDelete) throw new Error('File not found');

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([fileToDelete.file_path]);
      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('media_files')
        .delete()
        .eq('id', id);
      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media-files'] });
      toast({
        title: "File deleted",
        description: "The file has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete file: " + error.message,
      });
    },
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      const fileType = file.type.startsWith('image/') ? 'image' : 'video';

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('media_files')
        .insert({
          filename: file.name,
          file_path: filePath,
          content_type: file.type,
          type: fileType,
          size: file.size,
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['media-files'] });
      toast({
        title: "Upload successful",
        description: "Your file has been uploaded to the library.",
      });
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Library</h1>
          <p className="text-gray-600">Store and manage your media files</p>
        </div>
        <div className="relative">
          <Input
            type="file"
            onChange={handleFileUpload}
            accept="image/*,video/*"
            disabled={uploading}
            className="hidden"
            id="file-upload"
          />
          <Button
            asChild
            disabled={uploading}
          >
            <label htmlFor="file-upload" className="cursor-pointer">
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              Upload Media
            </label>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {mediaFiles?.map((file) => (
            <div
              key={file.id}
              className="group relative bg-white rounded-lg border shadow-sm overflow-hidden"
            >
              <div className="aspect-video relative">
                {file.type === 'image' ? (
                  <img
                    src={`${supabase.storage.from('media').getPublicUrl(file.file_path).data.publicUrl}`}
                    alt={file.filename}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    src={`${supabase.storage.from('media').getPublicUrl(file.file_path).data.publicUrl}`}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className={cn(
                    "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
                    deleteMutation.isPending && "opacity-100"
                  )}
                  onClick={() => deleteMutation.mutate(file.id)}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {file.type === 'image' ? (
                    <ImageIcon className="h-4 w-4" />
                  ) : (
                    <Video className="h-4 w-4" />
                  )}
                  <span className="truncate">{file.filename}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;
