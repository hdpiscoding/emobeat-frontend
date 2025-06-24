/* eslint-disable */
import React, {useEffect} from 'react';
import {SongListHeader} from "@/components/SongListHeader.tsx";
import {SongListItem} from "@/components/SongListItem.tsx";
import {getMyfavorites} from "@/services/musicServices.ts";

const header = {
    title: "My favorite",
    description: "This is my favorite songs",
    image: "https://img.freepik.com/premium-vector/my-favorite-song-handwriting-quote-calligraphy-phrase-vector-illustration_112545-2143.jpg",
}

export const MyFavorite = () => {
    const [myFavorites, setMyFavorites] = React.useState();
    const [page, setPage] = React.useState(1);

    useEffect(() => {
        fetchMyFavorites();
    }, []);

    const fetchMyFavorites = async () => {
        try {
            const response = await getMyfavorites(page, 10);
            setMyFavorites(response.data?.items);
        } catch (error) {
            console.error("Error fetching my favorites:", error);
        }
    }
    return (
        <div className="flex flex-col gap-10 w-full px-4 mt-1">
            <SongListHeader image={header?.image} description={header?.description ?? ""} title={header?.title ?? ""} theme={"#FFD1DC"}></SongListHeader>

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
                <span className="text-center">Duration</span>
            </div>

            <div>
                {myFavorites?.map((song, index) => (
                    <SongListItem key={index} song={song?.music} id={index + 1} callFrom={"favorites"} />
                ))}
            </div>
        </div>
    );
}