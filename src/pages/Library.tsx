import { Loader2 } from "lucide-react";
import { useMediaLibrary } from "@/hooks/use-media-library";
import { UploadButton } from "@/components/Library/UploadButton";
import { MediaGrid } from "@/components/Library/MediaGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LibraryScheduler } from "@/components/Library/LibraryScheduler";

const Library = () => {
  const { mediaFiles, isLoading, deleteFile, isDeletingFile } = useMediaLibrary();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Content Library</h1>
      
      <Tabs defaultValue="library" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="library">Saved Library</TabsTrigger>
          <TabsTrigger value="schedule">Schedule Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="library" className="space-y-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Saved Library</h2>
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
        </TabsContent>
        
        <TabsContent value="schedule">
          <LibraryScheduler />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Library;
