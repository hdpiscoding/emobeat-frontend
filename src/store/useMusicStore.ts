import { create } from 'zustand';

interface Track {
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
}

interface MusicState {
    queue: Track[];
    originalQueue: Track[];
    isPlaying: boolean;
    currentTrack: Track | null;
    volume: number;
    setVolume: (volume: number) => void;
    setQueue: (tracks: Track[]) => void;
    addToQueue: (track: Track) => void;
    playTrack: (track: Track) => void;
    nextTrack: () => void;
    onTrackEnd: () => void;
    unshuffledQueue: Track[];
    isShuffled: boolean;
    setIsShuffled: (isShuffled: boolean) => void;
    shuffleQueue: () => void;
    unshuffleQueue: () => void;
    togglePlay: (isPlaying: boolean) => void;
}

const MAX_QUEUE_LENGTH = 20;

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function uniqueById(tracks: Track[]): Track[] {
    const seen = new Set<number>();
    return tracks.filter(track => {
        if (seen.has(track.id)) return false;
        seen.add(track.id);
        return true;
    });
}

export const useMusicStore = create<MusicState>((set, get) => ({
    queue: [],
    originalQueue: [],
    currentTrack: null,
    isPlaying: false,
    volume: 0.5,
    unshuffledQueue: [],
    isShuffled: false,
    setVolume: (volume: number) => set({ volume }),

    setQueue: (tracks) => {
        const uniqueTracks = uniqueById(tracks);
        // Always enforce MAX_QUEUE_LENGTH on originalQueue
        const limitedTracks = uniqueTracks.slice(0, MAX_QUEUE_LENGTH);
        const { currentTrack } = get();

        // Set originalQueue to the full track list
        set({ originalQueue: limitedTracks });

        // If no currentTrack, queue is same as originalQueue
        if (!currentTrack) {
            set({ queue: limitedTracks });
        }
        // If currentTrack exists, filter it from queue to avoid duplication
        else {
            const queueWithoutCurrent = limitedTracks.filter(track =>
                track.id !== currentTrack.id
            );
            set({ queue: queueWithoutCurrent });
        }
    },

    addToQueue: (track) => {
        const { queue } = get();
        // Avoid adding duplicates
        if (queue.some((t) => t.id === track.id) || get().currentTrack?.id === track.id) {
            return;
        }
        // Add to queue if under max length
        if (queue.length < MAX_QUEUE_LENGTH) {
            set({
                queue: [...queue, track],
            });
        }
    },

    playTrack: (track) => {
        const { queue, originalQueue } = get();
        // Remove track from queue if present
        const filteredQueue = queue.filter((t) => t.id !== track.id);
        // Update state
        set({
            currentTrack: track,
            queue: filteredQueue,
            isPlaying: false, // Reset to ensure clean playback
        });
        // Add to originalQueue if not present and under max length
        if (!originalQueue.some((t) => t.id === track.id) && originalQueue.length < MAX_QUEUE_LENGTH) {
            set({
                originalQueue: [...originalQueue, track],
            });
        }
    },

    nextTrack: () => {
        const { queue } = get();

        if (queue.length > 0) {
            // Always pop the first item when next is called
            const nextTrack = queue[0];
            set({
                currentTrack: nextTrack,
                queue: queue.slice(1),
                isPlaying: false,
            });
            setTimeout(() => {
                set({
                    isPlaying: true,
                })
            }, 200);
            // Replenish queue
            // get().replenishQueue();
        } else {
            // No tracks left
            set({
                isPlaying: false,
            });
        }
    },

    onTrackEnd: () => {
        const { queue } = get();

        if (queue.length > 0) {
            // If there are tracks in queue, proceed to next track
            get().nextTrack();
        } else {
            // No more tracks in queue, stop playback
            set({
                isPlaying: false,
            });
        }
    },

    shuffleQueue: () => {
        const { queue, isShuffled } = get();

        // Don't re-shuffle if already shuffled
        if (isShuffled) return;

        // Remember original order before shuffling
        set({
            unshuffledQueue: [...queue],
            queue: shuffleArray(queue),
            isShuffled: true
        });
    },

    unshuffleQueue: () => {
        const { unshuffledQueue, isShuffled } = get();

        // Only restore if we're in shuffled state
        if (!isShuffled) return;

        set({
            queue: [...unshuffledQueue],
            isShuffled: false
        });
    },

    togglePlay: (isPlaying) => set({ isPlaying }),

    setIsShuffled: (isShuffled) => set({ isShuffled }),
}));