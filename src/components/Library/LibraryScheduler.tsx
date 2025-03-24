import { useState, useEffect } from 'react';
import { SchedulerComponent } from '@/components/Scheduler/SchedulerComponent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ContentType = "image" | "video" | "text";

type LibraryContent = {
  id: string;
  title: string;
  type: ContentType;
  url: string;
  thumbnail?: string;
};

export function LibraryScheduler() {
  const [libraryContent, setLibraryContent] = useState<LibraryContent[]>([]);

  useEffect(() => {
    // Here you would fetch your actual library content
    // For now, we'll create content from the files in the image
    const content: LibraryContent[] = [
      {
        id: "1",
        title: "horror 1 samples.mp4",
        type: "video",
        url: "/horror 1 samples.mp4",
        thumbnail: "/horror 1 samples.mp4"
      },
      {
        id: "2",
        title: "dominate logo peo.jpeg",
        type: "image",
        url: "/dominate logo peo.jpeg",
        thumbnail: "/dominate logo peo.jpeg"
      }
    ];

    setLibraryContent(content);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Content Scheduling</CardTitle>
          <CardDescription>Schedule your saved content for social media posting</CardDescription>
        </CardHeader>
        <CardContent>
          {libraryContent.length > 0 ? (
            <SchedulerComponent libraryContent={libraryContent} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No content found in library. Please add some content first.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 