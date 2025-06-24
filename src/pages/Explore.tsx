import React, { useState } from 'react';
import { Input } from "@/components/ui/input.tsx";
import { LuSearch } from "react-icons/lu";
import { Outlet, useNavigate } from "react-router-dom";


export const Explore = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            if (search.trim()) {
                navigate(`/explore/search?song=${encodeURIComponent(search.trim())}`);
            }
            else {
                navigate('/explore');
            }
        }
    };

    return (
        <div className="flex flex-col gap-10 w-full px-4 mt-1">
            <div className="relative w-full">
                <Input
                    className="pl-9 focus-visible:ring-[#518EE6] lg:w-[600px]"
                    placeholder="Search for musics..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <LuSearch className="absolute left-0 top-0 my-3 mx-2.5 h-4 w-4 text-muted-foreground"/>
            </div>
            <Outlet/>
        </div>
    );
}