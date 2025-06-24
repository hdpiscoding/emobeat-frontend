import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export const AlbumCard = ({album} : {album:any}) => {
    const navigate = useNavigate();
    return (
        <Card
            key={album.id}
            onClick={() => navigate(`/albums/${album.id}`)}
            className="flex-1 bg-primary rounded-[10px] p-0 border-none cursor-pointer transition-transform duration-200 hover:scale-103 hover:shadow-lg hover:-translate-y-1"
        >
            <div className="flex items-center w-full rounded-[10px] mb-2">
                <img
                    className="w-full h-[150px] object-cover rounded-t-[10px]"
                    alt={album.name}
                    src={album.coverPhoto}
                />
            </div>

            <CardContent className="flex flex-col items-start gap-2 p-[15px] pt-1">
                <div className="flex flex-col w-[150px] h-12 items-start gap-1">
                    <h4 className="w-full mt-[-1.00px] font-h4 text-white text-[length:var(--h4-font-size)] tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)]">
                        {album.name}
                    </h4>

                    <p className="w-full opacity-80 font-text-small font-[number:var(--text-small-font-weight)] text-white text-[length:var(--text-small-font-size)] tracking-[var(--text-small-letter-spacing)] leading-[var(--text-small-line-height)] [font-style:var(--text-small-font-style)]">
                        {album.artist}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}