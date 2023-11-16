import React from 'react';
import FlagNotificationPopup from '../FlagNotificationPopup';
import { getRaceTime, flagToColor } from '../../helpers/Functions';
import { useNavigate } from 'react-router-dom';

// Icons import
import { BiFontSize } from "react-icons/bi";
import { RiFullscreenLine} from "react-icons/ri";
import { IoColorPalette, IoFilterOutline } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";


interface ActiveRaceHeaderProps {
    activeRace: any;
    isTabletOrMobile: boolean;
    currentViewers: number;
    hash: string | any;
    openTab: Function;
    setShowFilters: Function;
};

const ActiveRaceHeader: React.FC<ActiveRaceHeaderProps> = (
        {
            activeRace, isTabletOrMobile, currentViewers, hash,
            openTab, setShowFilters
        }
    ) => {

    const navigate = useNavigate();

    return (
        <header>
            <div className="app_liveList-selected-track-name">
                <p>{activeRace?.race_details?.name}</p>
                <span>{activeRace?.race_details?.track_name}</span>
                <span>{`Track length: ${activeRace?.race_details?.track_length} km`}</span>
            </div>
            <div className="app_liveList-selected-time">
                <p>{getRaceTime(activeRace)}</p>
            </div>
            <div
                className="app_liveList-selected-time-flag-line"
                style={{background: flagToColor(activeRace?.race_details?.flag)}}
            />
            {
                !isTabletOrMobile &&
                <div className="app_liveList-selected-viewers">
                    <p>Now watching</p>
                    <span>{currentViewers}</span>
                </div>
            }
            {
                !isTabletOrMobile &&
                <button className="app_liveList-selected-fullscreen"
                    onClick={() => { navigate(`/live/full/${hash}`) }}
                >
                    Fullscreen
                    <RiFullscreenLine color="#ffffff" size={"20px"}/>
                </button>
            }
            <div className="app_liveList-selected-settings">
                {
                    !isTabletOrMobile &&
                    <button className="app_liveList-selected-settings-btn"
                        onClick={() => openTab("color")}
                    >
                        <IoColorPalette color="#ffffff" size={"25px"}/>
                    </button>
                }
                <button className="app_liveList-selected-settings-btn">
                    <BiFontSize color="#ffffff" size={"25px"}/>
                </button>
                <button className="app_liveList-selected-settings-btn"
                    onClick={() => setShowFilters()}
                >
                    <IoFilterOutline color="#ffffff" size={"25px"}/>
                </button>
                <button className="app_liveList-selected-settings-btn"
                    onClick={() => openTab("settings")}
                >
                    <IoMdSettings color="#ffffff" size={"25px"}/>
                </button>
            </div>
            {
                !isTabletOrMobile &&
                <FlagNotificationPopup data={activeRace?.race_details?.flag}/>
            }
        </header>
    );
};

export default ActiveRaceHeader;