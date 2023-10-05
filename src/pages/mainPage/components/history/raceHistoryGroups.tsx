import "./raceHistoryGroups.scss";
import { BoardTable } from "../../../../components/ScoreboardTable/ScoreboardTable";
import { BoardTableMini } from "../../../../components/ScoreboardTable/ScoreboardTableMini";
import { useMediaQuery } from 'react-responsive';

interface RaceHistoryData {
    id: number;
    event_name: string;
    event_track_name: string;
    event_date: string;
    event_country: string;
    event_sport: number;
}

export interface RaceHistoryElement {
    data: RaceHistoryData[];
    current_page: number;
};

const SmallScreenComponent = () =>
    <BoardTableMini
        legend={[
            {data: "event_sport", name: "Type", width: 20, img: false, center: true, customSrc: ""},
            {data: "event_country", name: "State", width: 20, img: true, center: true, customSrc: ""},
            {data: "event_name", name: "Event Name", width: 60, img: false, center: false, customSrc: ""},
        ]}
        data={{}}
        properties={{filters: true}}
    />;

const LargeScreenComponent = () =>
    <BoardTable
        legend={[
            {data: "event_sport", name: "Type", width: 5, img: true, center: true, customSrc: "/icons/"},
            {data: "event_country", name: "State", width: 5, img: true, center: true, customSrc: ""},
            {data: "event_name", name: "Event Name", width: 40, img: false, center: false, customSrc: ""},
            {data: "event_track_name", name: "Track Name", width: 40, img: false, center: false, customSrc: ""},
            {data: "parsed_date", name: "Date", width: 10, img: false, center: true, customSrc: ""}
        ]}
        data={{}}
        properties={{filters: true}}
    />;

export const RaceHistoryGroups = () => {


    const isSmallScreen = useMediaQuery({ maxWidth: 600 });

    return (
        <div className="app__historyGroups_main">
            <header>
                <h3>Event History</h3>
                <p>Click on a event to view more info about event runs and results.</p>
            </header>
            {isSmallScreen ? <SmallScreenComponent /> : <LargeScreenComponent />}
            </div>

    );
}
/*

onClick={() => {
                                navigate(`/history/${item.id}`, {
                                    state: {
                                        eventId: item.id,
                                        eventTrack: item.event_track_name,
                                        eventDate: item.event_date
                                    }
                                })
                             }}
*/