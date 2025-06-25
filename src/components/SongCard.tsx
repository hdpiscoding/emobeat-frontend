import { Card, CardContent } from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import {searchMusic} from "@/services/musicServices.ts";
import {useMusicStore} from "@/store/useMusicStore.ts";

export const SongCard = ({id, title, image, artist, emotion} : {id: number, title: string, image: string, artist: string, emotion: string}) => {
    const { playTrack, togglePlay, currentTrack } = useMusicStore();

    const handleClick = async () => {
        if (currentTrack && currentTrack.id === id) {
            togglePlay(true);
            return;
        }
        const body = {
            filters: [
                { operator: 'equal', key: 'id', value: id },
            ],
            sorts: [{ key: 'id', type: 'ASC' }],
        };
        try {
            const response = await searchMusic(body, 1, 1);
            const song = response.data?.items[0];
            const track = {
                id: song.id,
                name: song.name,
                coverPhoto: song.coverPhoto,
                resourceLink: song.resourceLink,
                description: song.description,
                artists: song.artists || [],
            }
            playTrack(track);
            setTimeout(() => {
                togglePlay(true);
            }, 300);
        } catch (error) {
            console.error("Error fetching song details:", error);
        }
    }

    return (
        <Card
            key={id}
            className="flex-1 bg-primary rounded-[10px] p-0 border-none cursor-pointer transition-transform duration-200 hover:scale-103 hover:shadow-lg hover:-translate-y-1"
            onClick={handleClick}
        >
            <div className="flex items-center w-full rounded-[10px] mb-2">
                <img
                    className="w-full h-[150px] object-cover rounded-t-[10px]"
                    alt={"image"}
                    src={image}
                />
            </div>

            <CardContent className="flex flex-col items-start gap-2 p-[15px] pt-1">
                <div className="flex flex-col w-[150px] h-15 items-start gap-1">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <h4
                                    className="w-full mt-[-1.00px] font-h4 text-white text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)]
                                    line-clamp-2 cursor-pointer"
                                    style={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {title}
                                </h4>
                            </TooltipTrigger>
                            <TooltipContent className="text-[#333] bg-[#eee]">
                                {title}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <p className="w-full opacity-80 font-text-small font-[number:var(--text-small-font-weight)] text-white text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] [font-style:var(--text-small-font-style)]">
                        {artist}
                    </p>

                    <p className="w-full opacity-80 font-text-small font-[number:var(--text-small-font-weight)] text-white text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] [font-style:var(--text-small-font-style)]">
                        Emotion: {emotion}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}