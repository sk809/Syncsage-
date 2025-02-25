
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { MediaFile } from "@/types/media";

export function useMediaLibrary() {
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

      const { error: storageError } = await supabase.storage
        .from('media')
        .remove([fileToDelete.file_path]);
      if (storageError) throw storageError;

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

  return {
    mediaFiles,
    isLoading,
    deleteFile: deleteMutation.mutate,
    isDeletingFile: deleteMutation.isPending,
  };
}
