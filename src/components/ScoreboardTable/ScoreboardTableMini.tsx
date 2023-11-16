import "./ScoreboardTable.scss";
import { useNavigate } from "react-router-dom";
import SelectField from "../Fields/SelectField/SelectField";
import { useState, useEffect, useRef } from "react";
import { countries, sports, monthNames } from "../../helpers/static/data";
import { OptionsTransformer } from "../../helpers/OptionsTransformer";
import { parseDate } from "../../helpers/Parsers";
import { BoardTableProps } from "./ScoreboardTable";
import { getBackendServerAddr } from "../../pages/mainPage/mainPage";

export const BoardTableMini: React.FC<BoardTableProps> = ({legend, data, properties}) => {

    const navigate = useNavigate();
    const [maxPage, setMaxPage] = useState(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentPageData, setCurrentPageData] = useState<any>();

    const [countryFilterValue, setCountryFilterValue] = useState<string>();
    const [sportFilterValue, setSportFilterValue] = useState<string | null>();

    const legendBar: any = [];
    const legendItems: any = [];

    const getDataWithFilters = async () => {
        setCurrentPage(1); // set current page to 1
        const filters = {
            country: countryFilterValue,
            sports: sportFilterValue
        };
        // get max pages
        // get data for page 1
        // show data
    };

    const getPageData = async (currentPage: number = 1) => {
        const response = await fetch(`${getBackendServerAddr()}/api/getPageEvents?page=${currentPage}`);
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
                const response = await fetch(`${getBackendServerAddr()}/api/getMaxPages`);
                const data = await response.json();
                setMaxPage(data.pages);
            } catch (err) {
                console.log(err);
            }
        };
        getMaxPage();
    }, [maxPage]);

    useEffect(() => {
        if (!currentPage || !maxPage) { return; }
        getPageData(currentPage);
    }, [maxPage, currentPage]);

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
        <div className="__board_table_mini_wrapped">
            <div className="__board_table_mini_filter">
                <div className="__board_table_mini_filter_items">
                    <SelectField
                        className="__board_table_filter_item"
                        id="app__historyGroups_selector_country"
                        options={new OptionsTransformer(countries).get()}
                        name="countries"
                        label="Country"
                        onChange={(val: any) => { setCountryFilterValue(val!.value) }}
                    />
                    <SelectField
                        className="__board_table_filter_item"
                        id="app__historyGroups_selector_sport"
                        options={new OptionsTransformer(sports).get()}
                        onChange={(val: any) => { setSportFilterValue(val!.value) }}
                        label="Sport"
                        name="sports"
                    />
                </div>
            </div>
            <div
                className="__board_table_mini_"
                style={{width: properties.width, height: properties.height}}
            >
                <div className="__board_table_mini_legend">
                    {legendBar}
                </div>
                <div className="__board_table_mini_data">
                    {
                        currentPageData && currentPageData.data.map((item: any, index: number) =>
                            <div
                                className="__board_table_mini_data_item"
                                key={`${index}_board_table_mini_data_item`}
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
                                            <img src={`https://flagcdn.com/${item?.[item_name.data].toLowerCase()}.svg`} /> :
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
                        }
                    }}
                >{`<`}</button>
                <span>{`${currentPage} / ${maxPage}`}</span>
                <button
                    onClick={() => {
                        if (currentPage + 1 <= maxPage!) {
                            setCurrentPage(currentPage + 1);
                        }
                    }}
                >{`>`}</button>
            </div>
        </div>
    );
};