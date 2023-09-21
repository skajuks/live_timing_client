import "./mainPage.scss";
import { LiveList } from "./components/live/liveList";
import { SelectedLiveRace } from "./components/selectedLive/selectedLiveRace";
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
                    <li>Race History</li>
                </ul>
            </nav>
            <div className="app__navbar-infobox">
                This page is currently running in beta version, please be aware of any occoring bugs.
            </div>
            <Routes>
                <Route path={"/"} element={<LiveList />} />
                <Route path={"/history"} />
                <Route path={"/history/:hash"} />
                <Route path={"/live/"} />
                <Route path={"/live/:hash"} element={<SelectedLiveRace />}/>
            </Routes>
            <footer className="app__live-footer">

            </footer>
        </div>
    );
};