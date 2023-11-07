import "./raceHistoryGroups.scss";
import { BoardTable } from "../../../../components/ScoreboardTable/ScoreboardTable";
import { useState, useEffect } from "react";
import { parseDate } from "../../../../helpers/Parsers";
import { useNavigate } from "react-router-dom";


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

    const navigate = useNavigate();

    const [maxPage, setMaxPage] = useState(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentPageData, setCurrentPageData] = useState<any>();

    const [countryFilterValue, setCountryFilterValue] = useState<string>("");
    const [sportFilterValue, setSportFilterValue] = useState<string | null>("");
    const [nameFilterValue, setNameFilterValue] = useState<string>("");
    const [dateFilterValue, setDateFilterValue] = useState<string>("desc");

    const getPageData = async (currentPage: number = 1) => {
        const response = await fetch(`http://localhost:3015/api/getPageEvents?page=${currentPage}`);
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

    const getDataWithFilters = async (args: any) => {
        setCurrentPage(1);
        try {
            const pageStr = `http://localhost:3015/api/getMaxPages?country=${args.values.ctry}&sports=${args.values.sports}&name=${args.values.name}`
            const response = await fetch(pageStr);
            const data = await response.json();
            if (!data.pages || data.pages === 0) {
                setCurrentPageData(null);
                return setMaxPage(data.pages);
            }
            if (data.pages) {
                setMaxPage(data.pages);
                const response = await fetch(`http://localhost:3015/api/getPageEvents?page=${currentPage}&country=${args.values.ctry}&sports=${args.values.sports}&date=${args.values.date}&name=${args.values.name}`);
                const pageData = await response.json();
                if (pageData.data) {
                    pageData.data.forEach((item: any) => {
                        if (item.event_date) {
                            item.parsed_date = parseDate(item.event_date);
                        } else {
                            item.parsed_date = "";
                        }
                    })
                }
                setCurrentPageData(pageData?.data);
            }
        } catch (error) {

        }
        // get max pages
        // get data for page 1
        // show data
    };

    const navigateTo = (item: any) => {
        navigate(`/history/${item.event_date}/${item.event_track_name}`);
    };

    useEffect(() => {
        // get the max page amount
        const getMaxPage = async () => {
            try {
                const response = await fetch("http://localhost:3015/api/getMaxPages");
                const data = await response.json();
                setMaxPage(data.pages);
            } catch (err) {
                console.log(err);
            }
        };
        getMaxPage();
        getPageData(currentPage);
    }, []);

    const bg = localStorage.getItem("background");

    return (
        <div
            className="app__historyGroups_main"
            style={{
                    backgroundImage: bg ? `url('/svg/${bg}.svg')` : "url('/svg/Squares.svg')",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                }}
        >
            <header>
                <h3>Event History</h3>
            </header>
            <BoardTable
                legend={[
                    {data: "event_sport", dataParent: "", name: "Type", width: 5, minWidth: 50, img: true, center: true, customSrc: "/icons/", customElement: ""},
                    {data: "event_country", dataParent: "", name: "State", width: 5, minWidth: 40, img: true, center: true, customSrc: "", customElement: ""},
                    {data: "event_name", dataParent: "", name: "Event Name", width: 40, minWidth: 100, img: false, center: false, customSrc: "", customElement: ""},
                    {data: "event_track_name", dataParent: "", name: "Track Name", width: 30, minWidth: 100, img: false, center: false, customSrc: "", customElement: ""},
                    {data: "parsed_date", dataParent: "", name: "Date", width: 20, minWidth: 80, img: false, center: true, customSrc: "", customElement: ""}
                ]}
                data={{}}
                properties={{
                    filters: true, navHistory: true, pageSwitch: true, maxPage: maxPage, sportFilterValue: sportFilterValue, dateFilterValue: dateFilterValue, nameFilterValue: nameFilterValue,
                    countryFilterValue: countryFilterValue, currentPageData: currentPageData, currentPage: currentPage
                }}
                functions={{maxPage: setMaxPage, currentPage: setCurrentPage, currentPageData: setCurrentPageData, pageData: getPageData, setCurrentPage: setCurrentPage,
                            setCountryFilterValue: setCountryFilterValue, setSportFilterValue: setSportFilterValue,
                            setNameFilterValue: setNameFilterValue, setDateFilterValue: setDateFilterValue
                }}
                customFunctions={{filters: getDataWithFilters, navigateTo: navigateTo}}
            />
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