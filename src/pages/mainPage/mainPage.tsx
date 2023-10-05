import "./mainPage.scss";
import { LiveList } from "./components/live/liveList";
import { SelectedLiveRace } from "./components/selectedLive/selectedLiveRace";
import { SelectedLiveFull } from "./components/selectedLiveFull/selectedLiveFull";
import { RaceHistoryGroups } from './components/history/raceHistoryGroups';
import { RaceHistoryEvent } from "./components/history/event/raceHistoryEvent";
import { PositionCanvas, PositionCanvas_Test } from "./components/PositionCanvas";
import { Route, Routes, useNavigate } from "react-router-dom";

export const MainPage = () => {

    const navigate = useNavigate();

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
                    <li onClick={() => { navigate("/history") }}>Race History</li>
                </ul>
            </nav>
            <div className="app__navbar-infobox">
                This page is currently running in beta version, please be aware of any occurring bugs.
            </div>
            <Routes>
                <Route path={"/"} element={<LiveList />} />
                <Route path={"/history"} element={<RaceHistoryGroups />} />
                <Route path={"/history/:hash"} element={<RaceHistoryEvent />} />
                <Route path={"/history/:hash/:eventId"} />
                <Route path={"/live/"} />
                <Route path={"/live/:hash"} element={<SelectedLiveRace />} />
                <Route path={"/live/full/:hash"} element={<SelectedLiveFull />} />
                <Route path={"/test"} element={<PositionCanvas_Test />} />
            </Routes>

            <footer className="app__live-footer">
                This is a footer
                footer template text
            </footer>
        </div>
    );
};