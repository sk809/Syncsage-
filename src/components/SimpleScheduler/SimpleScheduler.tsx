import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Instagram, Twitter, Facebook } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SocialPlatform = "instagram" | "twitter" | "facebook";
type LibraryItem = {
  id: string;
  title: string;
  type: "image" | "video" | "text";
  thumbnail?: string;
};

interface SimpleSchedulerProps {
  libraryContent?: LibraryItem[];
}

export function SimpleScheduler({ libraryContent = [] }: SimpleSchedulerProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("12:00");
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<Array<{
    id: string;
    contentId: string;
    date: Date;
    time: string;
    platforms: SocialPlatform[];
  }>>([]);

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSchedule = () => {
    if (!date || !selectedContent) return;

    const newPost = {
      id: crypto.randomUUID(),
      contentId: selectedContent,
      date,
      time,
      platforms: selectedPlatforms,
    };

    setScheduledPosts(prev => [...prev, newPost]);
    setSelectedContent("");
    setSelectedPlatforms([]);
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case "instagram": return <Instagram className="h-4 w-4" />;
      case "twitter": return <Twitter className="h-4 w-4" />;
      case "facebook": return <Facebook className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Post</CardTitle>
          <CardDescription>Select content and schedule it for social media</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Content Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Content</label>
            <Select value={selectedContent} onValueChange={setSelectedContent}>
              <SelectTrigger>
                <SelectValue placeholder="Choose content from library" />
              </SelectTrigger>
              <SelectContent>
                {libraryContent.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    <div className="flex items-center gap-2">
                      <span>{item.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Platform Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Platforms</label>
            <div className="flex gap-2">
              {(["instagram", "twitter", "facebook"] as SocialPlatform[]).map((platform) => (
                <Button
                  key={platform}
                  variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePlatform(platform)}
                  className="flex items-center gap-2"
                >
                  {getPlatformIcon(platform)}
                  <span className="capitalize">{platform}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Time</label>
            <Select value={time} onValueChange={setTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 24 }).map((_, hour) => (
                  <>
                    <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                      {hour.toString().padStart(2, '0')}:00
                    </SelectItem>
                    <SelectItem key={`${hour}:30`} value={`${hour}:30`}>
                      {hour.toString().padStart(2, '0')}:30
                    </SelectItem>
                  </>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button 
            className="w-full mt-4" 
            onClick={handleSchedule}
            disabled={!selectedContent || selectedPlatforms.length === 0}
          >
            Schedule Post
          </Button>
        </CardContent>
      </Card>

      {/* Scheduled Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Posts</CardTitle>
          <CardDescription>Your upcoming social media posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledPosts.map((post) => {
              const content = libraryContent.find(item => item.id === post.contentId);
              if (!content) return null;

              return (
                <div
                  key={post.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="space-y-1">
                    <p className="font-medium">{content.title}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{format(post.date, "PPP")}</span>
                      <Clock className="h-4 w-4 ml-2" />
                      <span>{post.time}</span>
                    </div>
                    <div className="flex gap-1 mt-2">
                      {post.platforms.map(platform => (
                        <div key={platform} className="text-muted-foreground">
                          {getPlatformIcon(platform)}
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setScheduledPosts(prev => prev.filter(p => p.id !== post.id))}
                    className="text-destructive hover:text-destructive/90"
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
            {scheduledPosts.length === 0 && (
              <p className="text-center text-muted-foreground py-4">
                No posts scheduled yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 