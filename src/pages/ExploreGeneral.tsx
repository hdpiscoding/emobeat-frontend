import React, {useEffect} from 'react';
import {GenreCard} from "@/components/GenreCard.tsx";
import {ArtistCard} from "@/components/ArtistCard.tsx";
import {AlbumCard} from "@/components/AlbumCard.tsx";
import {getGenres} from "@/services/genreServices.ts";
import {getAlbums} from "@/services/albumServices.ts";
import {getArtists} from "@/services/artistServices.ts";
import { Skeleton } from "@/components/ui/skeleton"

interface IGenre {
    id: number;
    name: string;
    picture: string;
    description: string;
}

interface IAlbum {
    id: number;
    name: string;
    coverPhoto: string;
    releaseDate: string;
    description: string;
}

interface IArtist {
    id: number;
    name: string;
    picture: string;
    description: string;
}

export const ExploreGeneral = () => {
    const [genres, setGenres] = React.useState<IGenre[]>([]);
    const [albums, setAlbums] = React.useState<IAlbum[]>([]);
    const [artists, setArtists] = React.useState<IArtist[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [genresData, albumsData, artistsData] = await Promise.all([
                getGenres(),
                getAlbums(5),
                getArtists(6)
            ]);
            setGenres(genresData?.data);
            setAlbums(albumsData?.data);
            setArtists(artistsData?.data);
        } catch (error) {
            console.error("Failed to fetch genres:", error);
        }
    }

    return (
        <>
            <div>
                <header>
                    <h2 className="text-3xl font-bold">
                        Top Albums
                    </h2>
                </header>

                {albums && albums.length > 0
                    ?
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-6 mb-10">
                        {albums?.map((album) => (
                            <AlbumCard album={album}></AlbumCard>
                        ))}
                    </div>
                    :
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-6 mb-10">
                        {Array(5).fill(0).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="w-full h-[225px] rounded-[10px] bg-[#ddd]"
                            />
                        ))}
                    </div>}

            </div>

            <div>
                <header>
                    <h2 className="text-3xl font-bold">
                        Popular Artists
                    </h2>
                </header>

                {artists && artists.length > 0
                    ?
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mt-6 lg:gap-12 gap-6">
                        {artists?.map((artist) => (
                            <ArtistCard artist={artist}></ArtistCard>
                        ))}
                    </div>
                    :
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mt-6 lg:gap-12 gap-6">
                        {Array(6).fill(0).map((_, i) => (
                            <Skeleton
                                key={i}
                                className="w-full h-[188px] rounded-lg bg-[#ddd]"
                            />
                        ))}
                    </div>
                }
            </div>

            <div>
                <header>
                    <h2 className="text-3xl font-bold">
                        Music Genres
                    </h2>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                    {genres?.map((category) => (
                        <GenreCard category={category}></GenreCard>
                    ))}
                </div>
            </div>
        </>
    );
}