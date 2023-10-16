import "./raceHistoryGroups.scss";
import { BoardTable } from "../../../../components/ScoreboardTable/ScoreboardTable";
import { BoardTableMini } from "../../../../components/ScoreboardTable/ScoreboardTableMini";
import { useMediaQuery } from 'react-responsive';
import { useState, useEffect } from "react";
import { parseDate } from "../../../../helpers/Parsers";

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

export const RaceHistoryGroups = () => {

    const [maxPage, setMaxPage] = useState(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentPageData, setCurrentPageData] = useState<any>();

    const [countryFilterValue, setCountryFilterValue] = useState<string>("");
    const [sportFilterValue, setSportFilterValue] = useState<string | null>("");
    const [nameFilterValue, setNameFilterValue] = useState<string>("");
    const [dateFilterValue, setDateFilterValue] = useState<string>("desc");

    const getPageData = async (currentPage: number = 1) => {
        const response = await fetch(`http://192.168.8.252:3002/api/getPageEvents?page=${currentPage}`);
        const data = await response.json();
        if (data.data) {
            data.data.forEach((item: any) => {
                if (item.event_date) {
                    item.parsed_date = parseDate(item.event_date);
                } else {
                    item.parsed_date = "";
                }
            })
        }
        setCurrentPageData(data.data);
    };

    useEffect(() => {
        // get the max page amount
        const getMaxPage = async () => {
            try {
                const response = await fetch("http://192.168.8.252:3002/api/getMaxPages");
                const data = await response.json();
                setMaxPage(data.pages);
            } catch (err) {
                console.log(err);
            }
        };
        getMaxPage();
        getPageData(currentPage);
    }, []);

    return (
        <div
            className="app__historyGroups_main"
            style={{backgroundImage: "url('/svg/Lines.svg')"}}
        >
            <header>
                <h3>Event History</h3>
                <p>Click on a event to view more info about event runs and results.</p>
            </header>
            <BoardTable
                legend={[
                    {data: "event_sport", dataParent: "", name: "Type", width: 5, img: true, center: true, customSrc: "/icons/", customElement: ""},
                    {data: "event_country", dataParent: "", name: "State", width: 5, img: true, center: true, customSrc: "", customElement: ""},
                    {data: "event_name", dataParent: "", name: "Event Name", width: 40, img: false, center: false, customSrc: "", customElement: ""},
                    {data: "event_track_name", dataParent: "", name: "Track Name", width: 40, img: false, center: false, customSrc: "", customElement: ""},
                    {data: "parsed_date", dataParent: "", name: "Date", width: 10, img: false, center: true, customSrc: "", customElement: ""}
                ]}
                data={{}}
                properties={{
                    filters: true, navHistory: true, pageSwitch: true, maxPage: maxPage, sportFilterValue: sportFilterValue, dateFilterValue: dateFilterValue, nameFilterValue: nameFilterValue,
                    countryFilterValue: countryFilterValue, currentPageData: currentPageData, currentPage: currentPage
                }}
                functions={{maxPage: setMaxPage, currentPage: setCurrentPage, pageData: getPageData, setCurrentPage: setCurrentPage,
                            setCountryFilterValue: setCountryFilterValue, setSportFilterValue: setSportFilterValue,
                            setNameFilterValue: setNameFilterValue, setDateFilterValue: setDateFilterValue
                }}
            />
            <div className="app__sponsors_line">
                <h4>Our Supporters</h4>
            </div>
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