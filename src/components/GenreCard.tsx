import React from 'react';
import {useNavigate} from "react-router-dom";

export const GenreCard = ({ category }: any) => {
    const navigate = useNavigate();
    return (
        <div
            className="flex-1 bg-primary rounded-[10px] p-0 border-none cursor-pointer transition-transform duration-200 hover:scale-103 hover:shadow-lg hover:-translate-y-1"
            onClick={() => navigate(`/genres/${category.id}`)}>
            <div className="flex items-center w-full rounded-[10px] mb-2">
                <img
                    className="w-full h-[150px] object-cover rounded-t-[10px]"
                    alt={"category"}
                    src={category.picture}
                />
            </div>
            <div className="flex flex-col items-start gap-2 p-[15px] pt-1">
                <h4 className="w-full font-h4 text-white text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)]">
                    {category.name}
                </h4>
            </div>
        </div>
    )
};
