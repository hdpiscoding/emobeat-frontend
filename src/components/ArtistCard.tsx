/* eslint-disable */
import React from 'react';
import {useNavigate} from "react-router-dom";

export const ArtistCard = ({ artist }: any) => {
    const navigate = useNavigate();
    return (
        <div
            onClick={() => navigate(`/artists/${artist.id}`)}
            className="flex flex-col items-center p-4 bg-white rounded-lg shadow w-40 cursor-pointer transition-transform duration-200 hover:scale-103 hover:shadow-lg hover:-translate-y-1">
            <img
                src={artist.picture}
                alt={"artist"}
                className="w-24 h-24 object-cover rounded-full mb-3 border-2 border-gray-200"
            />
            <span className="text-base font-semibold text-gray-800 text-center">{artist.name}</span>
        </div>
    )
};