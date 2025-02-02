import { useState } from "react";
import { Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const sounds = [
  { id: 1, name: "Rainfall", type: "nature" },
  { id: 2, name: "Ocean Waves", type: "nature" },
  { id: 3, name: "Alpha Waves", type: "binaural" },
  { id: 4, name: "White Noise", type: "ambient" },
];

export const SoundPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([50]);
  const [activeSound, setActiveSound] = useState(sounds[0]);

  return (
    <div className="p-6 bg-gradient-to-br from-secondary to-white rounded-xl">
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-medium">{activeSound.name}</h3>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-12 w-12 rounded-full"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <Volume2 className="h-5 w-5 text-gray-500" />
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          {sounds.map((sound) => (
            <Button
              key={sound.id}
              variant={activeSound.id === sound.id ? "default" : "outline"}
              onClick={() => setActiveSound(sound)}
              className="w-full"
            >
              {sound.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};