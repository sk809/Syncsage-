
import { useState, useEffect } from "react";
import { Loader2, Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

const SPOTIFY_CLIENT_ID = "339b9e640ea84178b43a4ae91bf69de3";
const REDIRECT_URI = window.location.origin + "/relax";

const RelaxMode = () => {
  const [token, setToken] = useState<string | null>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isPaused, setIsPaused] = useState(true);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [volume, setVolume] = useState(50);
  const { toast } = useToast();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = window.localStorage.getItem('spotify_token');
      if (!token) {
        const scopes = 'streaming user-read-email user-read-private user-library-read user-library-modify';
        const authUrl = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(scopes)}`;
        window.location.href = authUrl;
        return;
      }

      const player = new window.Spotify.Player({
        name: 'Mind Relaxation Mode',
        getOAuthToken: cb => { cb(token); }
      });

      player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
        setPlayer(player);
      });

      player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      player.addListener('player_state_changed', (state) => {
        if (!state) return;
        setCurrentTrack(state.track_window.current_track);
        setIsPaused(state.paused);
      });

      player.connect();
    };

    // Check for token in URL after redirect
    const hash = window.location.hash;
    if (hash) {
      const token = hash.substring(1).split('&').find(elem => elem.startsWith('access_token'))?.split('=')[1];
      if (token) {
        window.localStorage.setItem('spotify_token', token);
        setToken(token);
        window.location.hash = '';
      }
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePlayPause = () => {
    if (!player) return;
    player.togglePlay();
  };

  const handleNext = () => {
    if (!player) return;
    player.nextTrack();
  };

  const handlePrevious = () => {
    if (!player) return;
    player.previousTrack();
  };

  const handleVolumeChange = (value: number[]) => {
    if (!player) return;
    const volume = value[0];
    setVolume(volume);
    player.setVolume(volume / 100);
  };

  if (!player) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Connecting to Spotify...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Mind Relaxation Mode</h1>
        <p className="text-gray-600 mt-2">Relax and focus with your favorite music</p>
      </div>

      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex flex-col items-center space-y-6">
            {currentTrack && (
              <>
                <div className="w-64 h-64 rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src={currentTrack.album.images[0].url} 
                    alt={currentTrack.name}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900">{currentTrack.name}</h2>
                  <p className="text-gray-600">{currentTrack.artists[0].name}</p>
                </div>
              </>
            )}

            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handlePrevious}
              >
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button 
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={handlePlayPause}
              >
                {isPaused ? (
                  <Play className="h-6 w-6" />
                ) : (
                  <Pause className="h-6 w-6" />
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleNext}
              >
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center space-x-2 w-full max-w-sm">
              <Volume2 className="h-4 w-4 text-gray-500" />
              <Slider
                value={[volume]}
                onValueChange={handleVolumeChange}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelaxMode;
