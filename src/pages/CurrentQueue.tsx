/* eslint-disable */
import React from 'react';
import {SongListHeader} from "@/components/SongListHeader.tsx";
import {SongListItem} from "@/components/SongListItem.tsx";
import {useMusicStore} from "@/store/useMusicStore.ts";

const header = {
    title: "Current Queue",
    description: "This is the current queue of songs you have added.",
    image: "/icon/emobeat_vertical.png",
}

export const CurrentQueue = () => {
    const queue = useMusicStore((state) => state.queue);
    return (
        <div className="flex flex-col gap-10 w-full px-4 mt-1">
            <SongListHeader image={header?.image} description={header?.description ?? ""} title={header?.title ?? ""} theme={"#0B77B3"}></SongListHeader>

            <div
                className="grid items-center justify-items-start w-full py-3 px-4 text-sm font-semibold text-[#333] grid-cols-3 lg:grid-cols-4
  "
                style={{
                    gridTemplateColumns: '5% 60% 20% 10% 5%',
                }}
            >
                <span className="text-center">#</span>
                <span className="text-center">Title</span>
                <span className="text-center hidden lg:block">Album</span>
                <span className="text-center">Emotion</span>
            </div>

            <div>
                {queue.map((song, index) => (
                    <SongListItem key={index} song={song} id={index + 1} />
                ))}
            </div>
        </div>
    );
}