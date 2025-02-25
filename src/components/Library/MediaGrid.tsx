
import { Loader2, Image as ImageIcon, Video, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import type { MediaFile } from "@/types/media";

interface MediaGridProps {
  files: MediaFile[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function MediaGrid({ files, onDelete, isDeleting }: MediaGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {files?.map((file) => (
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
                isDeleting && "opacity-100"
              )}
              onClick={() => onDelete(file.id)}
              disabled={isDeleting}
            >
              {isDeleting ? (
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
  );
}
