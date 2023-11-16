import "./selectedLiveRace.scss";
import { useState, useEffect, useRef } from 'react';
import { useParams } from "react-router-dom";

import ResizableTable from "../../../../components/ResizeTable/ResizableTable";
import { useMediaQuery } from "react-responsive";
import ResizableTableFilter from "../../../../components/ResizeTable/ResizableFilter";
import { getBackendServerAddr } from "../../mainPage";
import ScoreboardLeaderRow from "../../../../components/ScoreboardLeaderRow";
import ColorSelector from "../../../../components/Selectors/ColorSelector";
import SettingsSelector from "../../../../components/Selectors/SettingsSelector";
import ActiveRaceHeader from "../../../../components/Headers/ActiveRaceHeader";

import { io } from "socket.io-client";

// Resizable components
import { ResizableTableFastestLapComponent,
         ResizableTableImgComponent,
         ResizableTablePosComponent,
         ResizableTablePosMobileComponent,
         ResizableTableStartNrComponent,
         ResizableTableStatusComponent,
         ResizableTableSurnameComponent,
         ResizableTableSurnameMobileComponent
        } from "../resizableTableComponents/resizableTableComponents";

const socket = io(getBackendServerAddr());

interface raceDataElement {
    race_details: any;
    race_competitors_list: any;
    race_time: any;
};

const fields = {
    banned: ["position_by_time", "position_by_lap", "diff_by_time", "diff_by_lap", "gap_by_time", "gap_by_lap", "position_change_by_time", "position_change_by_lap", "finished_time"],
    enabled: ["position", "nr", "state", "status", "firstname", "lastname", "class", "team", "lap", "best_lap_time", "gap", "diff", "lap_time"],
    verticalModeDefaults: {
            position: {
                            customElement: ResizableTablePosMobileComponent,
                            width: 14,  // percentage
                            maxWidth: 60,   // pixels
                            shortname: "Pos"
                      },
            nr: {
                width: 15,
                maxWidth: 60,
                shortname: "Nr",
                customElement: ResizableTableStartNrComponent
            },
            lastname: {
                    width: 33,
                    justifyStart: true,
                    customElement: ResizableTableSurnameMobileComponent
            },
            best_lap_time: {
                width: 33,
                justifyStart: true,
                customElement: ResizableTableFastestLapComponent
            },
    },
    enabledClasses: [],
    defaultFontSize: 20,
    order: ["position", "nr", "state", "state2", "status", "firstname", "lastname", "class", "team", "make", "lap", "best_lap_time", "lap_time", "elapsed_time", "diff", "gap"],
    config: {
        position: {
            customElement: ResizableTablePosComponent,
            label: "Position",
            defaultWidth: 90
        },
        nr: {
            customElement: ResizableTableStartNrComponent,
            label: "Start nr",
            defaultWidth: 90
        },
        state: {
            customElement: ResizableTableImgComponent,
            label: "Country",
            isImageElement: true,
            defaultWidth: 90
        },
        state2: {
            customElement: ResizableTableImgComponent,
            label: "Country 2",
            defaultWidth: 90
        },
        status: {
            customElement: ResizableTableStatusComponent,
            label: "Change",
            defaultWidth: 90,
        },
        firstname: { label: "Name", defaultWidth: 220 },
        lastname: {
            customElement: ResizableTableSurnameComponent,
            label: "Surname",
            defaultWidth: 220
        },
        best_lap_time: {
            label: "Best lap time",
            defaultWidth: 150,
            customElement: ResizableTableFastestLapComponent,
        },
        lap_time: {
            label: "Last lap time",
        },
        elapsed_time: {
            label: "Elapsed time",
        },
        make: { label: "Make" },
        team: { label: "Team", defaultWidth: 140 },
        lap: { label: "Laps" },
        diff: { label: "Diff", defaultWidth: 90 },
        gap: { label: "Gap", defaultWidth: 90 },
        class: { label: "Class"},
    }
};

const defaultScoreboardColors = ["#1c2431d0", "#191b26d0"];

export const SelectedLiveRace = () => {
    const {hash} = useParams();
    const [activeRace, setActiveRace] = useState<raceDataElement>();
    const [currentViewers, setCurrentViewers] = useState<number>(0);
    const [selectedColors, setSelectedColors] = useState<string[]>(defaultScoreboardColors);
    const [fieldsData, setFieldData] = useState<any>(fields);

    const bg = localStorage.getItem("background");
    const ref = useRef(null);

    const [showFilters, setShowFilters] = useState<boolean>(false);

    const [enableAutoScroll, setEnableAutoScroll] = useState(false);

    // Media queries
    const isTabletOrMobile = useMediaQuery({ query: "(max-width: 850px)" });
    const isPortrait = useMediaQuery({ query: "(orientation: portrait)" });

    const [openedTabs, setOpenedTabs] = useState<any>({
        color: false,
        fontSize: false,
        settings: false,
    });

    const getFilterData = (data: any) => {
        setFieldData({...fieldsData, enabled: data.fields, enabledClasses: data.classes});
    };

    function openTab(tabName: string) {
        const tmp = {...openedTabs, color: false, fontSize: false, settings: false};
        tmp[tabName] = !openedTabs[tabName];
        setOpenedTabs(tmp);
    };

    const startScrollAnimation = (): void => {
        let scrollContainer: any = ref.current;
        const delay = 3000;
        const amount = 39;
        const max = 570;

        const scrollToTop = () => {
            if (!scrollContainer) return;
            scrollContainer.scrollTop = 0;
        };
        const scrollToBottom = () => {
            if (!scrollContainer) return;
            scrollContainer.scrollTop += amount;
        };

        const scroll = () => {
            if (!scrollContainer) {
                scrollContainer = ref.current;
            }

            if (!enableAutoScroll) {
                scrollContainer.scrollTop = 0;
                return;
            }

            // console.log(scrollContainer.scrollTop);
            if (scrollContainer.scrollTop + max > scrollContainer.scrollHeight) {
                // If reaching the bottom, reset scrollTop to 0 with smooth scrolling
                setTimeout(scrollToTop, delay);
            } else {
                // Scroll smoothly by the specified amount
                setTimeout(scrollToBottom, delay);
            }

            requestAnimationFrame(scroll);
        };
        if (!enableAutoScroll) {
            scrollContainer.scrollTop = 0;
            return;
        }
        setTimeout(scroll, delay);
    }

    useEffect(() => {
        socket.emit("joinRaceRoom", hash);
    }, []);

    socket.on("updateViewerCount", (count: number) => {
        setCurrentViewers(count);
    });

    useEffect(() => {
        const getActiveRace = async () => {
            try {
                if (!hash) { return; }
                socket.emit("getActiveRaceData", hash, (data: any) => {
                    setActiveRace(data);
                });
            } catch (err) {
                console.log(err);
            }
        }
        const interval = setInterval(getActiveRace, 1000);
        return() => {
            clearInterval(interval)
        }
    }, []);

    return (
        <div className="app_liveList-selected-main">
            {
                openedTabs.color &&
                <ColorSelector
                    selectedColors={selectedColors}
                    saveCallback={(colors: any) => setSelectedColors(colors)}
                    resetCallback={() => setSelectedColors(defaultScoreboardColors)}
                />
            }
            {
                openedTabs.settings &&
                <SettingsSelector
                    onAutoScrollChange={(isChecked: boolean) => setEnableAutoScroll(isChecked)}
                    startScrollAnimation={startScrollAnimation}
                />
            }
            {
                activeRace ?
                <div
                    className="app_liveList-selected-results"
                    style={{
                        backgroundImage: bg ? `url('/svg/${bg}.svg')` : "url('/svg/Squares.svg')",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                >
                    <ActiveRaceHeader
                        activeRace={activeRace}
                        isTabletOrMobile={isTabletOrMobile}
                        currentViewers={currentViewers}
                        hash={hash}
                        openTab={(tabName: string) => openTab(tabName)}
                        setShowFilters={() => setShowFilters(!showFilters)}
                    />
                    <div className="app__live-filter">
                        <ResizableTableFilter
                            data={{
                                competitor: activeRace?.race_competitors_list,
                                race_info: activeRace?.race_details
                            }}
                            fields={fields}
                            callback={getFilterData}
                            show={showFilters}
                            mediaQuery={{
                                mobile: isTabletOrMobile,
                                portrait: isPortrait,
                            }}
                        />
                    </div>
                    <div
                        className="app__historyRace-table"
                        style={{width: isTabletOrMobile ? "100vw" : "1600px"}}
                        ref={ref}
                    >
                        <ResizableTable
                            data={{
                                competitor: activeRace?.race_competitors_list,
                                race_info: activeRace?.race_details
                            }}
                            fields={fieldsData}
                            fontSize={0.8}
                            colors={selectedColors}
                            mediaQuery={{
                                mobile: isTabletOrMobile,
                                portrait: isPortrait,
                            }}
                        />
                    </div>
                    {
                        !isTabletOrMobile &&
                        <div className="app__live_raceLeaders">
                            <div className="app__live_raceLeaders-inner">
                                <ScoreboardLeaderRow
                                    data={{
                                        competitor: activeRace?.race_competitors_list,
                                        race_info: activeRace?.race_details
                                    }}/>
                            </div>
                        </div>
                    }

                    <div className="app__Simulator">
                        <div className="simulator_inner">
                            Race simulator coming soon!
                        </div>

                    </div>
                </div>
                :
                <div className="app_liveList-selected-loading"
                    style={{
                        backgroundImage: `url('/svg/Loading.svg')`,
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                    }}
                />
            }
        </div>
    );
};