import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Download, 
  Link, 
  Play, 
  CheckCircle, 
  AlertCircle,
  Youtube,
  Twitter,
  Instagram,
  Zap
} from 'lucide-react';

interface VideoInfo {
  title: string;
  duration: string;
  thumbnail: string;
  platform: string;
  quality: string[];
}

const SUPPORTED_PLATFORMS = [
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
  { name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
  { name: 'TikTok', icon: Zap, color: 'text-purple-500' },
];

export const VideoDownloader = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [selectedQuality, setSelectedQuality] = useState('');
  const { toast } = useToast();

  const detectPlatform = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'Twitter';
    if (url.includes('instagram.com')) return 'Instagram';
    if (url.includes('tiktok.com')) return 'TikTok';
    return 'Unknown';
  };

  const handleAnalyze = async () => {
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid video URL",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate API call
    setTimeout(() => {
      const platform = detectPlatform(url);
      setVideoInfo({
        title: "Sample Video Title - Amazing Content!",
        duration: "2:34",
        thumbnail: "https://via.placeholder.com/320x180?text=Video+Thumbnail",
        platform,
        quality: ['720p', '480p', '360p']
      });
      setSelectedQuality('720p');
      setIsAnalyzing(false);
      
      toast({
        title: "Success",
        description: "Video analyzed successfully!",
      });
    }, 2000);
  };

  const handleDownload = async () => {
    if (!videoInfo) return;

    setIsDownloading(true);
    setProgress(0);

    // Simulate download progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDownloading(false);
          toast({
            title: "Download Complete",
            description: "Video downloaded successfully!",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* URL Input Section */}
      <Card className="p-8 bg-gradient-glass border border-white/10 backdrop-blur-sm shadow-card">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Enter Video URL
            </h2>
            <p className="text-muted-foreground">
              Paste the link from YouTube, Twitter, Instagram, TikTok, and more
            </p>
          </div>

          <div className="flex gap-4">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="pl-10 h-12 bg-secondary/50 border-white/10 focus:border-primary/50 focus:ring-primary/25 transition-smooth"
                onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !url.trim()}
              className="h-12 px-8 bg-gradient-primary hover:shadow-glow transition-spring"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white" />
                  Analyzing...
                </div>
              ) : (
                'Analyze'
              )}
            </Button>
          </div>

          {/* Supported Platforms */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/10">
            <span className="text-sm text-muted-foreground">Supported platforms:</span>
            <div className="flex gap-4">
              {SUPPORTED_PLATFORMS.map((platform) => (
                <div key={platform.name} className="flex items-center gap-2">
                  <platform.icon className={`h-5 w-5 ${platform.color}`} />
                  <span className="text-sm text-muted-foreground">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Video Info Section */}
      {videoInfo && (
        <Card className="p-6 bg-gradient-glass border border-white/10 backdrop-blur-sm shadow-card animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex gap-6">
            <div className="relative">
              <img
                src={videoInfo.thumbnail}
                alt="Video thumbnail"
                className="w-48 h-27 object-cover rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="h-12 w-12 text-white/80 bg-black/50 rounded-full p-3" />
              </div>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {videoInfo.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    {videoInfo.platform}
                  </span>
                  <span>Duration: {videoInfo.duration}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">
                    Quality
                  </label>
                  <div className="flex gap-2">
                    {videoInfo.quality.map((quality) => (
                      <Button
                        key={quality}
                        variant={selectedQuality === quality ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedQuality(quality)}
                        className="transition-smooth"
                      >
                        {quality}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="w-full h-11 bg-gradient-primary hover:shadow-glow transition-spring"
                >
                  <Download className="h-5 w-5 mr-2" />
                  {isDownloading ? 'Downloading...' : `Download ${selectedQuality}`}
                </Button>

                {isDownloading && (
                  <div className="space-y-2">
                    <Progress value={progress} className="h-2" />
                    <p className="text-sm text-muted-foreground text-center">
                      {progress}% complete
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            icon: Zap,
            title: "Lightning Fast",
            description: "Download videos in seconds with our optimized servers"
          },
          {
            icon: CheckCircle,
            title: "High Quality",
            description: "Choose from multiple quality options up to 4K resolution"
          },
          {
            icon: AlertCircle,
            title: "Safe & Secure",
            description: "No registration required, your privacy is protected"
          }
        ].map((feature, index) => (
          <Card key={index} className="p-6 bg-gradient-glass border border-white/10 backdrop-blur-sm shadow-card hover:shadow-glow transition-spring">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-primary">
                <feature.icon className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};