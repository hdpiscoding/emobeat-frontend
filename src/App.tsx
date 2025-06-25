import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {Home} from "./pages";
import MainLayout from "@/layouts/MainLayout.tsx";
import ScrollToTop from "@/layouts/ScrollToTop.tsx";
import {ChooseType} from "@/pages/ChooseType.tsx";
import {CurrentQueue} from "@/pages/CurrentQueue.tsx";
import {MyFavorite} from "@/pages/MyFavorite.tsx";
import {Settings} from "@/pages/Settings.tsx";
import {Explore} from "@/pages/Explore.tsx";
import {AlbumDetail} from "@/pages/AlbumDetail.tsx";
import {GenreDetail} from "@/pages/GenreDetail.tsx";
import {ArtistDetail} from "@/pages/ArtistDetail.tsx";
import {ExploreGeneral} from "@/pages/ExploreGeneral.tsx";
import {ExploreSearch} from "@/pages/ExploreSearch.tsx";
import {Login} from "@/pages/Login.tsx";
import {Register} from "@/pages/Register.tsx";
import {RegisterInfo} from "@/pages/RegisterInfo.tsx";
import {RegisterEmail} from "@/pages/RegisterEmail.tsx";
import {RegisterOTP} from "@/pages/RegisterOTP.tsx";
import { ProtectedRoute } from "@/routes/ProtectedRoute";


function App() {

    return (
        <>
            <Router>
                <ScrollToTop/>
                <Routes>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Register/>}>
                        <Route index element={<RegisterEmail/>}/>
                        <Route path="info" element={<RegisterInfo/>}/>
                        <Route path="otp" element={<RegisterOTP/>}/>
                    </Route>
                    <Route path="/choose-type" element={<ChooseType />} />
                    {/* You can replace the above line with your ChooseType component if needed */}

                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<MainLayout />}>
                            <Route index element={<Home />} />
                            <Route path="current-queue" element={<CurrentQueue />} />
                            <Route path="explore" element={<Explore />}>
                                <Route index element={<ExploreGeneral />} />
                                <Route path="search" element={<ExploreSearch />} />
                            </Route>
                            <Route path="favorite" element={<MyFavorite />} />
                            <Route path="settings" element={<Settings />} />
                            <Route path="albums/:albumId" element={<AlbumDetail />} />
                            <Route path="genres/:genreId" element={<GenreDetail />} />
                            <Route path="artists/:artistId" element={<ArtistDetail />} />
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default App
