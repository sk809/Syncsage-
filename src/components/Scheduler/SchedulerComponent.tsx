import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Instagram, Twitter, Facebook, Youtube, Image, Video, FileText } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ContentType = "image" | "video" | "text";
type SocialPlatform = "instagram" | "twitter" | "facebook" | "youtube";

type LibraryContent = {
  id: string;
  title: string;
  type: ContentType;
  url: string;
  thumbnail?: string;
};

type ScheduleEvent = {
  id: string;
  title: string;
  date: Date;
  time: string;
  description: string;
  content: LibraryContent;
  platforms: SocialPlatform[];
};

export function SchedulerComponent({ libraryContent }: { libraryContent: LibraryContent[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>("12:00");
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [description, setDescription] = useState<string>("");
  const [selectedContent, setSelectedContent] = useState<string>("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>([]);

  const handleAddEvent = () => {
    if (!date || !selectedContent) return;
    
    const content = libraryContent.find(c => c.id === selectedContent);
    if (!content) return;
    
    const newEvent: ScheduleEvent = {
      id: crypto.randomUUID(),
      title: content.title,
      date,
      time,
      description,
      content,
      platforms: selectedPlatforms,
    };
    
    setEvents([...events, newEvent]);
    setDescription("");
    setSelectedContent("");
    setSelectedPlatforms([]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((event) => event.id !== id));
  };

  const togglePlatform = (platform: SocialPlatform) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const getPlatformIcon = (platform: SocialPlatform) => {
    switch (platform) {
      case "instagram": return <Instagram className="h-4 w-4" />;
      case "twitter": return <Twitter className="h-4 w-4" />;
      case "facebook": return <Facebook className="h-4 w-4" />;
      case "youtube": return <Youtube className="h-4 w-4" />;
    }
  };

  const getContentIcon = (type: ContentType) => {
    switch (type) {
      case "image": return <Image className="h-4 w-4" />;
      case "video": return <Video className="h-4 w-4" />;
      case "text": return <FileText className="h-4 w-4" />;
    }
  };

  const getFileTypeFromUrl = (url: string): ContentType => {
    const extension = url.split('.').pop()?.toLowerCase() || '';
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) return 'image';
    if (['mp4', 'webm', 'mov'].includes(extension)) return 'video';
    return 'text';
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            Content Scheduler
          </CardTitle>
          <CardDescription>Schedule your content across social media platforms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Content from Library</Label>
              <Select value={selectedContent} onValueChange={setSelectedContent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose content from library" />
                </SelectTrigger>
                <SelectContent>
                  {libraryContent.map((content) => (
                    <SelectItem key={content.id} value={content.id}>
                      <div className="flex items-center gap-2">
                        {getContentIcon(getFileTypeFromUrl(content.url))}
                        <span>{content.title || content.url.split('/').pop()}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedContent && (
              <div className="relative rounded-lg overflow-hidden h-32 bg-muted">
                {libraryContent.find(c => c.id === selectedContent)?.thumbnail && (
                  <img 
                    src={libraryContent.find(c => c.id === selectedContent)?.thumbnail} 
                    alt="Content preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-2">
              {(["instagram", "twitter", "facebook", "youtube"] as SocialPlatform[]).map((platform) => (
                <Button
                  key={platform}
                  variant={selectedPlatforms.includes(platform) ? "default" : "outline"}
                  size="sm"
                  onClick={() => togglePlatform(platform)}
                  className="capitalize"
                >
                  {getPlatformIcon(platform)}
                  <span className="ml-2">{platform}</span>
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Caption/Description</Label>
            <Input
              id="description"
              placeholder="Add caption or description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date</Label>
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
            
            <div className="space-y-2">
              <Label>Time</Label>
              <div className="flex items-center space-x-2">
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <>
                        <SelectItem key={`${hour}:00`} value={`${hour}:00`}>
                          {hour < 10 ? `0${hour}:00` : `${hour}:00`}
                        </SelectItem>
                        <SelectItem key={`${hour}:30`} value={`${hour}:30`}>
                          {hour < 10 ? `0${hour}:30` : `${hour}:30`}
                        </SelectItem>
                      </>
                    ))}
                  </SelectContent>
                </Select>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleAddEvent}
            disabled={!selectedContent || selectedPlatforms.length === 0}
          >
            Schedule Post
          </Button>
        </CardContent>
      </Card>
      
      {events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Content</CardTitle>
            <CardDescription>Your upcoming scheduled posts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {events
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {event.content.thumbnail && (
                          <img 
                            src={event.content.thumbnail} 
                            alt={event.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <div className="flex gap-1">
                            {event.platforms.map(platform => (
                              <div key={platform} className="text-muted-foreground">
                                {getPlatformIcon(platform)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CalendarIcon className="h-3 w-3" />
                        <span>{format(event.date, "PPP")}</span>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>{event.time}</span>
                      </div>
                      {event.description && (
                        <p className="text-sm">{event.description}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteEvent(event.id)}
                      className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 