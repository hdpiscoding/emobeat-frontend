/* eslint-disable */
import React from 'react';
import { useGeneralStore } from "@/store/useGeneralStore";
import {useAuthStore} from "@/store/useAuthStore.ts";
import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog"
import { FaUserAlt } from "react-icons/fa";
import {SongCard} from "@/components/SongCard.tsx";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {getRecommendedQueue} from "@/services/musicServices.ts";
import {useMusicStore} from "@/store/useMusicStore.ts";

export const Home = () => {
    const navigate = useNavigate();
    const user = {
        name: "User",
        avatar: ""
    }
    const mappingEmotion = (value: number): string => {
        const emotionMap: { [key: number]: string } = {
            1: "neutral",
            2: "happy",
            3: "sad",
            4: "angry",
            5: "fearful",
            6: "disgusted",
            7: "surprised"
        };
        return emotionMap[value] || "unknown";
    };


    // const [recommendedQueue, setRecommendedQueue] = React.useState([]);
    // useEffect(() => {
    //     const fetchRecommendedQueue = async () => {
    //         try {
    //             const response = await getRecommendedQueue(5);
    //             setRecommendedQueue(response.data);
    //         } catch (error) {
    //             console.error("Error fetching recommended queue:", error);
    //         }
    //     };
    //
    //     fetchRecommendedQueue();
    // }, []);
    const queue = useMusicStore((state) => state.queue);

    const mode = useGeneralStore((state) => state.mode);
    const setMode = useGeneralStore((state) => state.setMode);
    const handleChooseMode = (newMode: "personal" | "driving" | "study") => {
        setMode(newMode);
        console.log(`Selected mode: ${newMode}`);
    };

    const clearAuth = useAuthStore((state) => state.clearAuth);
    const handleLogout = () => {
        console.log("User logged out");
        clearAuth();
        toast.success("Logged out successfully!");
        navigate("/login", { replace: true });
    }
    return (
        <div className="flex flex-col gap-10 w-full px-4 mt-1">
            <div className="flex gap-20 items-center lg:justify-end lg:pr-6">
                <div className="flex gap-4 items-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="lg:w-[500px] hover:bg-[#3A74C5]">
                                <span className="text-md">Mode: {mode}</span>
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="lg:w-[802px] md:w-[600px] w-[400px] max-w-[900px] py-20 px-0">
                            <div className="flex flex-col gap-6 items-center justify-center h-fit lg:w-[800px] md:w-[600px] w-[400px] p-4 bg-white">
                                <h1 className="text-2xl font-semibold mb-4 mt-8 text-[#333]">Please choose listening mode</h1>
                                <div className="flex flex-col lg:flex-row md:flex-row justify-center lg:gap-20 md:gap-12 gap-8 w-full lg:mb-8 md:mb-8">
                                    <DialogClose asChild>
                                        <div className="flex flex-col items-center justify-items-center gap-4 cursor-pointer">
                                            <Button onClick={() => handleChooseMode("personal")} className='flex items-center justify-center h-32 w-32 rounded-lg hover:bg-[#3A74C5]'>
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
                                    </DialogClose>

                                    <DialogClose asChild>
                                        <div className="flex flex-col items-center justify-items-center gap-4 cursor-pointer">
                                            <Button onClick={() => handleChooseMode("driving")} className='flex items-center justify-center h-32 w-32 rounded-lg hover:bg-[#3A74C5]'>
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
                                    </DialogClose>

                                    <DialogClose asChild>
                                        <div className="flex flex-col items-center justify-items-center gap-4 cursor-pointer">
                                            <Button onClick={() => handleChooseMode("study")} className='flex items-center justify-center h-32 w-32 rounded-lg hover:bg-[#3A74C5]'>
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
                                    </DialogClose>

                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>


                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center p-1 bg-[#e7e7e7] rounded-[50%] w-[40px] h-[40px] cursor-pointer hover:ring-[#518EE6] hover:ring-1">
                            {user?.avatar
                                ?
                                <img src={user.avatar} alt={"Avatar"} className="rounded-[50%] w-[30px] h-[30px]"/>
                                :
                                <div className="rounded-[50%] w-[30px] h-[30px] flex items-center justify-center">
                                    <FaUserAlt className="text-white w-[18px] h-[18px]"/>
                                </div>

                            }
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}><span className="text-red-500">Logout</span></DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div>
                <header>
                    <h2 className="text-3xl font-bold">
                        Current Queue
                    </h2>
                </header>

                {queue.length > 0
                    ?
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mt-6">
                            {queue.slice(0, 5).map((song : any) => (
                                <SongCard
                                    id={song?.id}
                                    title={song?.name}
                                    image={song?.coverPhoto}
                                    artist={song?.artists && song?.artists[0].name}
                                    emotion={mappingEmotion(song?.emotion)}
                                ></SongCard>
                            ))}
                        </div>

                        <div className="w-full flex items-center justify-center my-4">
                            <Button className="hover:bg-[#3A74C5]" onClick={() => navigate("/current-queue")}>
                                See all
                            </Button>
                        </div>
                    </div>
                    :
                    <div className="text-center text-gray-500 mt-6">Waiting for recommend</div>}


            </div>

        </div>
    )
}