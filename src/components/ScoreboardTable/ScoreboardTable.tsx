import "./ScoreboardTable.scss";
import { useNavigate } from "react-router-dom";
import SelectField from "../Fields/SelectField/SelectField";
import { useState, useEffect, useRef } from "react";
import { countries, sports, monthNames } from "../../helpers/static/data";
import { OptionsTransformer } from "../../helpers/OptionsTransformer";
import { parseDate } from "../../helpers/Parsers";
import { BsSortUpAlt, BsSortDownAlt } from "react-icons/bs";

export interface BoardField {
    data: string;
    name: string;
    width: number;
    img: boolean;
    center: boolean;
    customSrc: string;
};

export interface BoardTableProps {
    legend: BoardField[];
    data: any;
    properties: any; // You can specify a more specific type if needed
}

export const BoardTable: React.FC<BoardTableProps> = ({legend, data, properties}) => {

    const navigate = useNavigate();
    const [maxPage, setMaxPage] = useState(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentPageData, setCurrentPageData] = useState<any>();

    const [countryFilterValue, setCountryFilterValue] = useState<string>("");
    const [sportFilterValue, setSportFilterValue] = useState<string | null>("");
    const [nameFilterValue, setNameFilterValue] = useState<string>("");
    const [dateFilterValue, setDateFilterValue] = useState<string>("desc");

    const legendBar: any = [];
    const legendItems: any = [];

    const getDataWithFilters = async (values: any) => {
        setCurrentPage(1); // set current page to 1
        try {
            const pageStr = `http://localhost:3002/api/getMaxPages?country=${values.ctry}&sports=${values.sports}&name=${values.name}`
            const response = await fetch(pageStr);
            const data = await response.json();
            if (!data.pages || data.pages === 0) {
                setCurrentPageData(null);
                return setMaxPage(data.pages);
            }
            if (data.pages) {
                setMaxPage(data.pages);
                const response = await fetch(`http://localhost:3002/api/getPageEvents?page=${currentPage}&country=${values.ctry}&sports=${values.sports}&date=${values.date}&name=${values.name}`);
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
                setCurrentPageData(pageData);
            }
        } catch (error) {

        }
        // get max pages
        // get data for page 1
        // show data
    };

    const getPageData = async (currentPage: number = 1) => {
        const response = await fetch(`http://localhost:3002/api/getPageEvents?page=${currentPage}`);
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
        setCurrentPageData(data);
    };

    useEffect(() => {
        // get the max page amount
        const getMaxPage = async () => {
            try {
                const response = await fetch("http://localhost:3002/api/getMaxPages");
                const data = await response.json();
                setMaxPage(data.pages);
            } catch (err) {
                console.log(err);
            }
        };
        getMaxPage();
        getPageData(currentPage);
    }, []);

    const asdasd = (array: any) => {
        array.forEach((item: any, index: number) => {
            legendBar.push(
                <div
                    className="__board_table_legendField"
                    key={`${index}_board_table_field_legend`}
                    style={{
                        width: `${item.width}%`,
                        justifyContent : item.center ? "center" : "flex-start"
                    }}
                >
                <p
                    style={{marginLeft: item.center ? "0px" : "20px"}}
                >{item.name}</p>
                </div>
            )
            legendItems.push(item);
        })
    };
    asdasd(legend);

    return (
        <div className="__board_table_wrapped">
            {
                properties.filters &&
                <div className="__board_table_filter">
                    <div className="__board_table_filter_items">
                        <SelectField
                            className="__board_table_filter_item"
                            id="app__historyGroups_selector_country"
                            options={new OptionsTransformer(countries).get()}
                            name="countries"
                            label="Country"
                            onChange={(val : any) => {
                                setCountryFilterValue(val);
                                console.log(val);
                                getDataWithFilters({ctry: val,
                                                    sports: sportFilterValue,
                                                    date: dateFilterValue,
                                                    name: nameFilterValue
                                });
                            }}
                        />
                        <SelectField
                            className="__board_table_filter_item"
                            id="app__historyGroups_selector_sport"
                            options={new OptionsTransformer(sports).get()}
                            onChange={(val: any) => {
                                setSportFilterValue(val);
                                getDataWithFilters({ctry: countryFilterValue,
                                                    sports: val,
                                                    date: dateFilterValue,
                                                    name: nameFilterValue
                                });
                            }}
                            label="Sport"
                            name="sports"
                        />
                        <div className="__board_table_filter_name_filter">
                            <label>Event Name</label>
                            <input
                                type="text"
                                onChange={(event) => {
                                    setNameFilterValue(event.target.value);
                                }}
                            />
                        </div>
                        <button
                            onClick={() => {
                                getDataWithFilters({ctry: countryFilterValue,
                                                    sports: sportFilterValue,
                                                    date: dateFilterValue,
                                                    name: nameFilterValue
                                                });
                            }}
                        >Search Race name</button>
                        <div className="__board_table_date_sorters">
                            <button
                                value={"asc"}
                                style={{background: dateFilterValue === "asc" ? "#36129a" : "#171719"}}
                                onClick={() => {
                                        setDateFilterValue("asc");
                                        getDataWithFilters({ctry: countryFilterValue,
                                            sports: sportFilterValue,
                                            date: "asc",
                                            name: nameFilterValue
                                        });
                                }}
                            ><BsSortUpAlt size={"80%"}/></button>
                            <button
                                value={"desc"}
                                style={{background: dateFilterValue === "desc" ? "#36129a" : "#171719"}}
                                onClick={() => {
                                        setDateFilterValue("desc");
                                        getDataWithFilters({ctry: countryFilterValue,
                                            sports: sportFilterValue,
                                            date: "desc",
                                            name: nameFilterValue
                                        });
                                }}
                            ><BsSortDownAlt size={"80%"}/></button>
                        </div>
                    </div>
                </div>
            }
            <div
                className="__board_table"
                style={{width: properties.width, height: properties.height}}
            >
                <div className="__board_table_legend">
                    {legendBar}
                </div>
                <div className="__board_table_data">
                    {
                        currentPageData && currentPageData.data.map((item: any, index: number) =>
                            <div
                                className="__board_table_data_item"
                                key={`${index}_board_table_data_item`}
                                onClick={() => {
                                    navigate(`/history/${item.id}`, {
                                        state: {
                                            eventId: item.id,
                                            eventTrack: item.event_track_name,
                                            eventDate: item.event_date
                                        }
                                    })
                                }}
                            >
                                {
                                    legendItems.map((item_name: any, index: number) =>
                                        <p
                                            style={{
                                                width : `calc(${item_name.width}% - ${item_name.center ? 0 : 20}px`,
                                                justifyContent : item_name.center ? "center" : "flex-start",
                                                marginLeft : item_name.center ? "0px" : "20px",
                                            }}
                                            key={`${index}_race_hist_dataItem`}
                                        >{
                                            item_name.img ?
                                            <img
                                                style={
                                                    {width: item_name.customSrc ? "45px" : "26px", height: item_name.customSrc ? "45px" : "26px"}
                                                }
                                                src={item_name.customSrc ? `${item_name.customSrc}${item?.[item_name.data]}.png` : `https://flagcdn.com/${item?.[item_name.data].toLowerCase()}.svg`}
                                            /> :
                                            item?.[item_name.data]
                                        }</p>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>
            <div className="app__historyGroups_pageChange">
                <button
                    onClick={() => {
                        if (currentPage - 1 !== 0) {
                            setCurrentPage(currentPage - 1);
                            getPageData(currentPage - 1);
                        }
                    }}
                >{`<`}</button>
                <span>{`${currentPage} / ${maxPage}`}</span>
                <button
                    onClick={() => {
                        if (currentPage + 1 <= maxPage!) {
                            setCurrentPage(currentPage + 1);
                            getPageData(currentPage + 1);
                        }
                    }}
                >{`>`}</button>
            </div>
        </div>
    );  
};