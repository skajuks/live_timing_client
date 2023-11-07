import "./mainPage.scss";
import { LiveList } from "./components/live/liveList";
import { SelectedLiveRace } from "./components/selectedLive/selectedLiveRace";
import { SelectedLiveFull } from "./components/selectedLiveFull/selectedLiveFull";
import { RaceHistoryGroups } from './components/history/raceHistoryGroups';
import { RaceHistoryEvent } from "./components/history/event/raceHistoryEvent";
import { RaceHistoryRace } from "./components/history/race/raceHistoryRace";
import { PositionCanvas, PositionCanvas_Test } from "./components/PositionCanvas";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Slider from "react-slick";
import { useMediaQuery } from 'react-responsive'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const backgrounds = ["Interstellar", "Lines", "Triangles",
    "Hex", "Clouds", "Sky", "Raindrops", "Photon2", "Squares"
];

function importAll(r: __WebpackModuleApi.RequireContext) {
    return r.keys().map(r);
};

const ImageCarousel: React.FC = () => {
    const settings = {
        className: "slider",
        arrows: false,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 3000,
        slidesToShow: 5,
        slidesToScroll: 1,
    };
    const images: any[] = importAll(
        require.context("../../../public/supporters", false, /\.(png|jpe?g|svg)$/)
    );

    return (
        <div className="app__imageSlider">
            <Slider {...settings}>
            {images.map((image: string, index) => (
                <div className="app__imageSlider_img" key={`${index}_slider_img`}>
                    <img src={image} alt={`Image ${index}`} />
                </div>
            ))}
            </Slider>
        </div>
    );
};


export const MainPage = () => {

    const navigate = useNavigate();
    const [openBackground, setOpenBackground] = useState(false);
    const [selectedBackground, setSelectedBackground] = useState<string>(localStorage.getItem("background") || "Squares");

    // Media queries
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 850px)" });

    return (
        <div
            className="app__live-main"
        >
            <nav className="app__navbar">
                <ul>
                    <li>
                        <div className="app__navbar-logo">
                            <img src="/logo_new.png" alt="" />
                        </div>
                    </li>
                    <li onClick={() => { navigate("/") }}>Live Timing</li>
                    <li onClick={() => { navigate("/history") }}>Event History</li>
                    <li onClick={() => { setOpenBackground(!openBackground) }}>Backgrounds</li>
                </ul>
            </nav>
            <div className="app__navbar-infobox">
                This page is currently running in beta version, please be aware of any occurring bugs.
            </div>
            <AnimatePresence mode="wait">
            {
                openBackground &&
                <motion.div
                    className="app__background_opened"
                    initial={{y: -500}}
                    animate={{y: 0}}
                    transition={{bounce: false}}
                    exit={{y: -500}}
                >
                    <div className="app_background_opened_inner">
                    {
                        backgrounds.map((item: string, index: number) =>

                        <motion.div
                            className="app__background_card"
                            key={`background_card_${index}`}
                            style={{
                                backgroundImage: `url(/svg/${item}.svg`,
                                outline: selectedBackground === item ? "3px solid #eb4034" : "none"
                            }}
                            onClick={() => {
                                localStorage.setItem("background", item);
                                setSelectedBackground(item);
                            }}
                        >
                            <span>{item}</span>
                        </motion.div>

                        )
                    }
                    </div>
                </motion.div >
            }
            </AnimatePresence>
            <Routes>
                <Route path={"/"} element={<LiveList />} />
                <Route path={"/history"} element={<RaceHistoryGroups />} />
                <Route path={"/history/:date/:track_name"} element={<RaceHistoryEvent />} />
                <Route path={"/history/:date/:track_name/:eventId"} element={<RaceHistoryRace/>} />
                <Route path={"/live/"} />
                <Route path={"/live/:hash"} element={<SelectedLiveRace />} />
                <Route path={"/live/full/:hash"} element={<SelectedLiveFull />} />
                <Route path={"/test"} element={<PositionCanvas_Test />} />
            </Routes>
            {
                !isTabletOrMobile &&
                <div className="app__sponsors_line-wrapped">
                    <div className="app__sponsors_line">
                        <ImageCarousel />
                    </div>
                </div>
            }
            <footer className="app__live-footer">
                <span>Motorparks™  2023</span>
            </footer>
        </div>
    );
};