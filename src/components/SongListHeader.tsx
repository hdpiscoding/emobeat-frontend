//import React from 'react';
import { Skeleton } from "@/components/ui/skeleton"


export const SongListHeader = ({title, image, description, theme}: {title:string, image: string, description: string, theme:string}) => {
    return (
        <div className={`rounded-lg p-10`} style={{ backgroundColor: theme }}>
            <div className="flex gap-6 flex-col md:flex-row lg:flex-row">
                {image
                    ?
                    <img src={image} alt="image" className="rounded-md w-[400px] h-[400px]"/>
                    :
                    <Skeleton className="w-[400px] h-[400px] rounded-md bg-[#ddd]"/>
                }


                <div className="flex flex-col gap-6">
                    {title ? <h1 className="text-white font-bold">{title}</h1> : <Skeleton className="w-[600px] h-[40px] bg-[#ddd]"/>}

                    {description
                        ?
                        <p className="text-white">{description}</p>
                        :
                        <div className="flex flex-col gap-2">
                            <Skeleton className="w-[600px] h-[20px] bg-[#ddd]"/>
                            <Skeleton className="w-[600px] h-[20px] bg-[#ddd]"/>
                            <Skeleton className="w-[600px] h-[20px] bg-[#ddd]"/>
                        </div>}
                </div>
            </div>
        </div>
    );
}