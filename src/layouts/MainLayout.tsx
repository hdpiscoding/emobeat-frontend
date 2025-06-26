import {SidebarProvider} from "@/components/ui/sidebar.tsx";
import SideBar from "@/components/SideBar.tsx";
import {PlayingBar} from "@/components/PlayingBar.tsx";
import {useState, useRef, useEffect} from "react";
import ReactPlayer from 'react-player';
import {Webcam} from "@/components/ui/webcam.tsx";
import {Outlet} from "react-router-dom";
import {instance} from "@/config/axiosConfig.ts";
import {useMusicStore} from "@/store/useMusicStore.ts";
import {collectEmotion} from "@/services/emotionServices.ts";
import {useAuthStore} from "@/store/useAuthStore.ts";
import {useGeneralStore} from "@/store/useGeneralStore.ts";
import {getMySetting} from "@/services/userServices.ts";

// const emotionMap: { [key: string]: number } = {
//     neutral: 1,
//     happy: 2,
//     sad: 3,
//     angry: 4,
//     fearful: 5,
//     disgusted: 6,
//     surprised: 7
// };

export default function MainLayout(){
    const [audioUrl, setAudioUrl] = useState<string>('');
    const {
        nextTrack,
        onTrackEnd,
        shuffleQueue,
        unshuffleQueue,
        isShuffled,
        setIsShuffled,
        setVolume,
        togglePlay,
    } = useMusicStore();
    const userId = useAuthStore(state => state.userId);
    const isPlaying = useMusicStore(state => state.isPlaying);
    const volume = useMusicStore(state => state.volume);
    const currentTrack = useMusicStore(state => state.currentTrack);
    const emotion = useGeneralStore(state => state.emotion);

    const trackEvent = async (eventName: string, details: { musicId?: number, play_percentage?: number }) => {
        const body = {
            userId: userId,
            musicId: details.musicId,
            emotion: emotion,
            event: eventName,
            play_percentage: details.play_percentage
        };

        console.log(`Tracking Event: ${eventName}`, body);
        try {
            await collectEmotion(body);
        } catch (error) {
            console.error(`Error tracking event ${eventName}:`, error);
        }
    };

    useEffect(() => {
        let revokedUrl: string | null = null;
        const fetchAudio = async () => {
            if (audioUrl && audioUrl.startsWith('blob:')) {
                revokedUrl = audioUrl;
            }
            if (!currentTrack) {
                setAudioUrl('');
                return;
            }
            try {
                const response = await instance.get(currentTrack.resourceLink, { responseType: 'blob' });
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const playableUrl = URL.createObjectURL(blob);
                setAudioUrl(playableUrl);
            } catch (err) {
                setAudioUrl('');
                console.log(err);
            }
        };
        fetchAudio();
        return () => {
            if (revokedUrl) URL.revokeObjectURL(revokedUrl);
        };
    }, [currentTrack]);


    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoop, setIsLoop] = useState(false);
    const [isQueue, setIsQueue] = useState(false);
    const [pendingSeek, setPendingSeek] = useState<number | null>(null);
    const playerRef = useRef<ReactPlayer>(null);

    const handleReady = async () => {
        if (playerRef.current) {
            setDuration(playerRef.current.getDuration());
            await trackEvent('start_playing', { musicId: currentTrack?.id });
        }
    };

    const handleProgress = (state: { playedSeconds: number }) => {
        setCurrentTime(state.playedSeconds);
    };

    const handleSeek = (time: number) => {
        if (playerRef.current) {
            playerRef.current.seekTo(time, 'seconds');
            setCurrentTime(time);
        }
    };

    const handlePlayPause = () => {
        if (!isPlaying) {
            togglePlay(true);
            if (pendingSeek !== null && playerRef.current) {
                setTimeout(() => {
                    playerRef.current?.seekTo(pendingSeek, 'seconds');
                    setPendingSeek(null);
                }, 100);
            }
        } else {
            togglePlay(false);
        }
    };

    const handlePrev = () => {
        console.log('Previous song');
    };

    const handleNext = async () => {
        console.log('Next song');
        const playPercentage = Math.round((currentTime / duration) * 100);
        await trackEvent('skip', { musicId: currentTrack?.id, play_percentage: playPercentage });
        nextTrack();
    };

    const handleEnd = async () => {
        console.log('End song');
        if (isLoop) {
            console.log('Looping song');
            playerRef.current?.seekTo(0.01, 'seconds');
            togglePlay(false);
            setTimeout(() => {
                togglePlay(true);
            }, 100);
        } else {
            onTrackEnd();
        }
        await trackEvent('listen_through', { musicId: currentTrack?.id });
    };

    const handleShuffle = () => {
        // Store the new state value
        const newShuffledState = !isShuffled;

        // Update state
        setIsShuffled(newShuffledState);

        // Use the new value for logic decision
        if (newShuffledState) {
            shuffleQueue();
        } else {
            unshuffleQueue();
        }
    };

    const handleLoop = () => setIsLoop((v) => !v);
    const handleQueue = () => setIsQueue((v) => !v);

    const handleVolumeChange = (newVolume: number) => {
        setVolume(newVolume);
    }

    const {setAllowRecommend, setRecommendInterval, setDetectInterval} = useGeneralStore();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await getMySetting();
                setAllowRecommend(response.data?.isAllowRecommend);
                setRecommendInterval(response.data?.recommendInterval);
                setDetectInterval(response.data?.detectInterval);
            } catch (error) {
                console.error("Error fetching user settings:", error);
            }
        };
        fetchSettings();
    }, []);

    return (
        <SidebarProvider>
            <SideBar />
            <main className="flex flex-col h-screen w-full">
                {/* Sticky Webcam */}
                <div className="sticky top-0 z-20 bg-white">
                    <Webcam />
                </div>
                {/* Scrollable Outlet */}
                <div className="flex-1 w-full">
                    <Outlet />
                </div>
                {/* Sticky PlayingBar */}
                { currentTrack !== null && audioUrl !== ''
                    ?
                    <div className="sticky bottom-0 z-20 bg-white">
                        <ReactPlayer
                            key={currentTrack?.id}
                            ref={playerRef}
                            url={audioUrl}
                            playing={isPlaying}
                            volume={volume}
                            onEnded={handleEnd}
                            onReady={handleReady}
                            onProgress={handleProgress}
                            width="0"
                            height="0"
                        />
                        <PlayingBar
                            song={currentTrack}
                            duration={duration}
                            isPlaying={isPlaying}
                            isLoop={isLoop}
                            isShuffle={isShuffled}
                            isQueue={isQueue}
                            volume={volume}
                            currentTime={currentTime}
                            onPlayPause={handlePlayPause}
                            onPrev={handlePrev}
                            onNext={handleNext}
                            onShuffle={handleShuffle}
                            onLoop={handleLoop}
                            onQueue={handleQueue}
                            onSeek={handleSeek}
                            onVolumeChange={handleVolumeChange}
                        />
                    </div>
                    :
                    null}
            </main>
        </SidebarProvider>
    );
}