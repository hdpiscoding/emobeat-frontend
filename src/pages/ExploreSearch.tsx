/* eslint-disable */
import React, {useEffect} from 'react';
import {SongListItem} from "@/components/SongListItem.tsx";
import { useLocation } from "react-router-dom";

import {searchMusic} from "@/services/musicServices.ts";
import {Button} from "@/components/ui/button.tsx";

interface searchBody {
    filters: Array<{
        operator: string;
        key: string;
        value: any;
    }>;
    sorts: Array<{
        key: string;
        type: string;
    }>;
}

interface searchResult {
    id: number;
    name: string;
    coverPhoto: string;
    resourceLink: string;
    albums: Array<{
        id: number;
        name: string;
    }>;
    genres: Array<{
        id: number;
        name: string;
        picture: string;
    }>;
    artists: Array<{
        id: number;
        name: string;
        picture: string;
    }>;
}

export const ExploreSearch = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);

    const [searchQuery, setSearchQuery] = React.useState<string>(params.get('song') || '');
    const [searchResults, setSearchResults] = React.useState<searchResult[]>([]);
    const [page, setPage] = React.useState(1);

    useEffect(() => {
        setSearchQuery(params.get('song') || '');
        setPage(1); // Optionally reset page on new search
    }, [location.search]);

    const fetchSearchResults = async (query: string) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        const body: searchBody = {
            filters: [
                { operator: 'like', key: 'slug', value: query },
            ],
            sorts: [{ key: 'id', type: 'ASC' }],
        };

        try {
            const results = await searchMusic(body, page, 10);
            setSearchResults(results?.data?.items);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    }

    useEffect(() => {
        fetchSearchResults(searchQuery);
    }, [searchQuery, page]);

    return (
        <div>
            <div>
                <h1 className="text-2xl font-semibold my-2">
                    Search Results for "{searchQuery}"
                </h1>
            </div>

            { searchResults && searchResults.length > 0
                ?
                <div>
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
                        {searchResults.map((song, index) => (
                            <SongListItem key={index} song={song} id={index + 1} />
                        ))}
                    </div>

                    <div className="w-full flex items-center justify-center my-4">
                        <Button className="hover:bg-[#3A74C5]" onClick={() => setPage(prevPage => prevPage + 1)}>
                            Load more
                        </Button>
                    </div>
                </div>
                :
                <div>Oops, no song(s) found!</div>
            }


        </div>
    );
}