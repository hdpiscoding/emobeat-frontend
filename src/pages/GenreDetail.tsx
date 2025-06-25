/* eslint-disable */
import React, {useEffect} from 'react';
import {SongListHeader} from "@/components/SongListHeader.tsx";
import {SongListItem} from "@/components/SongListItem.tsx";
import {useParams} from "react-router-dom";
import {searchMusic} from "@/services/musicServices.ts";
import {getGenreDetail} from "@/services/genreServices.ts";

export const GenreDetail = () => {
    const {genreId} = useParams<{ genreId: string }>();
    const [genreDetail, setGenreDetail] = React.useState(null);
    const [songList, setSongList] = React.useState([]);
    const [page, setPage] = React.useState(1);

    useEffect(() => {
        fetchGenreDetail();
    }, [page]);

    const fetchGenreDetail = async () => {
        const body = {
            filters: [
                { operator: 'equal', key: 'genres.id', value: parseInt(genreId ?? "") },
            ],
            sorts: [{ key: 'id', type: 'asc' }],
        };
        try {
            const [response, genreResponse] = await Promise.all([
                searchMusic(body, page, 10),
                getGenreDetail(parseInt(genreId ?? ""))
            ]);
            setSongList(response.data?.items);
            setGenreDetail(genreResponse.data);
        } catch (error) {
            console.error("Error fetching genres:", error);
        }
    };

    return (
        <div className="flex flex-col gap-10 w-full px-4 mt-1">
            <SongListHeader image={genreDetail?.picture} description={genreDetail?.description ?? ""} title={genreDetail?.name ?? ""} theme={"#0B77B3"}></SongListHeader>

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
                {songList.map((song, index) => (
                    <SongListItem key={index} song={song} id={index + 1} />
                ))}
            </div>
        </div>
    );
}