/* eslint-disable */
import React from 'react';
import {useMusicStore} from "@/store/useMusicStore.ts";
import {searchMusic} from "@/services/musicServices.ts";
import { IoIosMore } from "react-icons/io";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {addToFavorites, removeFromFavorites, checkFavorite} from "@/services/musicServices.ts";
import {toast} from "react-toastify";

const formatTime = (sec: number) => {
    const totalSeconds = Math.floor(sec);
    return `${Math.floor(totalSeconds / 60)}:${(totalSeconds % 60).toString().padStart(2, "0")}`;
};

const mappingEmotion = (value: number): string => {
    const emotionMap: { [key: number]: string } = {
        1: "neutral",
        2: "happy",
        3: "sad",
        4: "angry",
        5: "fearful",
        6: "disgusted",
        7: "surprised"
    };
    return emotionMap[value] || "unknown";
};

export const SongListItem = ({
                                 id,
                                 song,
                                 callFrom
                             }: {
    id: number;
    song: any;
    callFrom?: string;
}) => {
    const {playTrack, togglePlay} = useMusicStore();
    const currentTrack = useMusicStore(state => state.currentTrack);

    const handleClick = async () => {
        if (currentTrack && currentTrack.id === id) {
            togglePlay(true);
            return;
        }
        if (!song.resourceLink) {
            const body = {
                filters: [
                    { operator: 'equal', key: 'id', value: song.id },
                ],
                sorts: [{ key: 'id', type: 'ASC' }],
            };
            try {
                const response = await searchMusic(body, 1, 1);
                const song = response.data?.items[0];
                const track = {
                    id: song.id,
                    name: song.name,
                    coverPhoto: song.coverPhoto,
                    resourceLink: song.resourceLink,
                    description: song.description,
                    artists: song.artists || [],
                }
                playTrack(track);
                setTimeout(() => {
                    togglePlay(true);
                }, 300);
            } catch (error) {
                console.error("Error fetching song details:", error);
            }
        }
        else {
            const track = {
                id: song.id,
                name: song.name,
                coverPhoto: song.coverPhoto,
                resourceLink: song.resourceLink,
                description: song.description,
                artists: song.artists || [],
            }
            playTrack(track);
            setTimeout(() => {
                togglePlay(true);
            }, 300);
        }
    }

    const addToFavorite = async () => {
        try {
            const res = await checkFavorite(song.id);
            if (res.data?.isInFavoriteList === true) {
                toast.error("This song is already in your favorites.");
            }
            else {
                await addToFavorites(song.id);
                toast.success("Added to favorites successfully.");
            }
        } catch (error) {
            console.error("Error adding to favorites:", error);
        }
    }

    const removeFromFavorite = async () => {
        try {
            await removeFromFavorites(song.id);
            toast.success("Removed from favorites successfully.");
        } catch (error) {
            console.error("Error removing from favorites:", error);
        }
    }
    return (
        <div
            className="
                grid items-center w-full py-3 px-4 text-sm
                grid-cols-3 lg:grid-cols-4
                rounded-lg transition-colors duration-150
                hover:bg-gray-100 cursor-pointer
            "
            style={{
                gridTemplateColumns: '5% 60% 20% 10% 5%',
            }}
            onClick={handleClick}
        >
            {/* ID */}
            <div className={`${currentTrack && currentTrack.id === song.id ? 'text-primary font-medium' : 'text-gray-500'}`}>{id}</div>
            {/* Image + Title + Artist */}
            <div className="flex items-center gap-6 min-w-0">
                <img
                    src={song.coverPhoto}
                    alt={song.name}
                    className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                />
                <div className="min-w-0">
                    <div className={`font-semibold truncate ${currentTrack && currentTrack.id === song.id ? 'text-primary' : 'text-[#333]'}`}>{song.name}</div>
                    <div className="text-[#333] text-xs truncate">{song.artists && song.artists[0]?.name}</div>
                </div>
            </div>
            {/* Album (hidden on sm, md) */}
            <div className="hidden lg:block truncate text-[#333]">
                {song.albums && song.albums[0]?.name}
            </div>
            {/* Duration */}
            <div className="text-[#333]">{mappingEmotion(song?.emotion) ?? formatTime(260)}</div>

            <div onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="cursor-pointer">
                            <IoIosMore className="hover:text-primary"/>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {callFrom && callFrom === 'favorites'
                            ?
                            <DropdownMenuItem className="cursor-pointer" onClick={removeFromFavorite}><span className="text-red-500">Remove from favorite</span></DropdownMenuItem>
                            :
                            <DropdownMenuItem className="cursor-pointer" onClick={addToFavorite}>Add to favorite</DropdownMenuItem>
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};