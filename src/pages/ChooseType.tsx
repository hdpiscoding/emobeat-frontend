import React from "react";
import {ListeningMode} from "@/components/ListeningMode.tsx";

export const ChooseType: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
            <ListeningMode></ListeningMode>
        </div>
    );
}