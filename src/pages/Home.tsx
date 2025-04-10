//import react from 'react'

import {Webcam} from "../components/ui/webcam.tsx";
//import SideBar from "../components/SideBar.tsx";
import MainLayout from "@/layouts/MainLayout.tsx";

export const Home = () => {
    return (
        <MainLayout>
            <Webcam/>
        </MainLayout>
    )
}