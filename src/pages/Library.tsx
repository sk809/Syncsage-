
import { Loader2 } from "lucide-react";
import { useMediaLibrary } from "@/hooks/use-media-library";
import { UploadButton } from "@/components/Library/UploadButton";
import { MediaGrid } from "@/components/Library/MediaGrid";

const Library = () => {
  const { mediaFiles, isLoading, deleteFile, isDeletingFile } = useMediaLibrary();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Saved Library</h1>
          <p className="text-gray-600">Store and manage your media files</p>
        </div>
        <UploadButton />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <MediaGrid 
          files={mediaFiles || []} 
          onDelete={deleteFile}
          isDeleting={isDeletingFile}
        />
      )}
    </div>
  );
};

export default Library;
