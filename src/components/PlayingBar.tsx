import { Shuffle, SkipBack, SkipForward, Repeat, ListMusic, Volume2 } from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { FaPlay } from "react-icons/fa6";
import { FaPause } from "react-icons/fa6";



interface PlayingBarProps {
    song: {
        id: number;
        name: string;
        coverPhoto: string;
        resourceLink: string;
        description: string;
        artists?: Array<{
            id: number;
            name: string;
            picture: string;
        }>;
    };
    duration: number;
    isPlaying: boolean;
    isLoop: boolean;
    isShuffle: boolean;
    isQueue: boolean;
    currentTime: number;
    volume: number;
    onPlayPause: () => void;
    onPrev: () => void;
    onNext: () => void;
    onShuffle: () => void;
    onLoop: () => void;
    onQueue: () => void;
    onSeek: (time: number) => void;
    onVolumeChange: (volume: number) => void;
}

export const PlayingBar: React.FC<PlayingBarProps> = ({
                                                          song,
                                                          duration,
                                                          isPlaying,
                                                          isLoop,
                                                          isShuffle,
                                                          isQueue,
                                                          volume,
                                                          currentTime,
                                                          onPlayPause,
                                                          onPrev,
                                                          onNext,
                                                          onShuffle,
                                                          onLoop,
                                                          onQueue,
                                                          onSeek,
                                                          onVolumeChange,
                                                      }) => {

    const formatTime = (sec: number) => {
        const totalSeconds = Math.floor(sec);
        return `${Math.floor(totalSeconds / 60)}:${(totalSeconds % 60).toString().padStart(2, "0")}`;
    };

    return (
        <div className="w-full px-4 py-2 bg-background border-t flex items-center justify-between gap-4">
            {/* Left: Song Info */}
            <div className="flex items-center min-w-0 gap-3 flex-1">
                <img src={song.coverPhoto} alt={"song"} className="w-14 h-14 rounded object-cover" />
                <div className="min-w-0">
                    <div className="font-semibold truncate">{song.name}</div>
                    <div className="text-sm text-muted-foreground truncate">{song.artists && song.artists[0]?.name}</div>
                </div>
            </div>

            {/* Center: Controls & Progress */}
            <div className="flex flex-col items-center flex-[2] min-w-0">
                {/* Controls */}
                <div className="flex items-center gap-4 mb-1">
                    <Button onClick={onShuffle} variant="ghost" className={`p-2 hover:text-[#3A74C5] ${isShuffle ? "bg-accent text-primary" : ""}`}><Shuffle size={20} /></Button>
                    <Button onClick={onPrev} variant="ghost" className="p-2 hover:text-[#3A74C5]"><SkipBack size={20} /></Button>
                    <Button
                        onClick={onPlayPause}
                        variant="ghost"
                        className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-[#3A74C5] hover:text-white"
                    >
                        {isPlaying ? <FaPause size={24} /> : <FaPlay className='w-[20px] h-[20px]' />}
                    </Button>
                    <Button onClick={onNext} variant="ghost" className="p-2 hover:text-[#3A74C5]"><SkipForward size={20} /></Button>
                    <Button onClick={onLoop} variant="ghost" className={`p-2 hover:text-[#3A74C5] ${isLoop ? "bg-accent text-primary" : ""}`}><Repeat size={20} /></Button>
                </div>
                {/* Progress Bar */}
                <div className="flex items-center gap-2 w-full">
                    <span className="text-xs w-10 text-right">{formatTime(currentTime)}</span>
                    <Slider
                        min={0}
                        max={duration}
                        step={1}
                        value={[currentTime]}
                        onValueChange={([val]) => onSeek(val)}
                        className="w-full cursor-pointer"
                    />
                    <span className="text-xs w-10">{formatTime(duration)}</span>
                </div>
            </div>

            {/* Right: Queue & Volume */}
            <div className="flex items-center gap-4 flex-1 justify-end">
                <Button onClick={onQueue} variant="ghost" className={`p-2 hover:text-[#3A74C5] ${isQueue ? "bg-accent text-primary" : ""}`}><ListMusic size={20} /></Button>
                <div className="flex items-center gap-2 w-24">
                    <Volume2 size={20} />
                    <Slider
                        min={0}
                        max={1}
                        step={0.01}
                        value={[volume]}
                        onValueChange={([val]) => {
                            onVolumeChange(val);
                        }}
                        className="w-full cursor-pointer"
                    />
                </div>
            </div>
        </div>
    );
};