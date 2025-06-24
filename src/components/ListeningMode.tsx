import React from "react";
import { Button } from "@/components/ui/button.tsx";
import { useGeneralStore } from "@/store/useGeneralStore";

export const ListeningMode = () => {
    const setMode = useGeneralStore((state) => state.setMode);
    const handleModeSelect = (mode: "personal" | "driving" | "study") => {
        setMode(mode);
        console.log(`Selected mode: ${mode}`);
    }
    return (
        <div className="flex flex-col gap-6 items-center justify-center h-fit lg:w-[800px] md:w-[600px] w-[400px] p-4 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4 mt-8 text-[#333]">Please choose listening mode</h1>
            <div className="flex flex-col lg:flex-row md:flex-row justify-center lg:gap-20 md:gap-12 gap-8 w-full lg:mb-8 md:mb-8">
                <div className="flex flex-col items-center justify-items-center gap-4 cursor-pointer">
                    <Button onClick={() => handleModeSelect("personal")} className='flex items-center justify-center h-32 w-32 rounded-lg hover:bg-[#3A74C5]'>
                        <img
                            src="/icon/personalization_white.svg"
                            alt="Personal"
                            width={70}
                            height={70}
                            className="pointer-events-none"
                        />
                    </Button>

                    <span className="font-semibold hover:text-[#518EE6]">
                        Personal
                    </span>
                </div>

                <div className="flex flex-col items-center justify-items-center gap-4 cursor-pointer">
                    <Button onClick={() => handleModeSelect("driving")} className='flex items-center justify-center h-32 w-32 rounded-lg hover:bg-[#3A74C5]'>
                        <img
                            src="/icon/driving_white.svg"
                            alt="Driving"
                            width={70}
                            height={70}
                            className="pointer-events-none"
                        />
                    </Button>

                    <span className="font-semibold hover:text-[#518EE6]">
                        Driving
                    </span>
                </div>

                <div className="flex flex-col items-center justify-items-center gap-4 cursor-pointer">
                    <Button onClick={() => handleModeSelect("study")} className='flex items-center justify-center h-32 w-32 rounded-lg hover:bg-[#3A74C5]'>
                        <img
                            src="/icon/study_white.svg"
                            alt="Study"
                            width={70}
                            height={70}
                            className="pointer-events-none"
                        />
                    </Button>

                    <span className="font-semibold hover:text-[#518EE6]">
                        Study
                    </span>
                </div>

            </div>
        </div>
    );
}