import "./ScoreboardTable.scss";
import { useNavigate } from "react-router-dom";
import SelectField from "../Fields/SelectField/SelectField";
import { countries, sports, monthNames } from "../../helpers/static/data";
import { OptionsTransformer } from "../../helpers/OptionsTransformer";
import { BsSortUpAlt, BsSortDownAlt } from "react-icons/bs";

export interface BoardField {
    data: string;
    dataParent: string;
    name: string;
    width: number;
    img: boolean;
    center: boolean;
    customSrc: string;
    customElement: any;
};

export interface BoardTableProps {
    legend: BoardField[];
    data: any;
    properties: any; // You can specify a more specific type if needed
    functions: any;
    customFunctions: any;
}

export const BoardTable: React.FC<BoardTableProps> = ({legend, data, properties, functions, customFunctions}) => {

    const navigate = useNavigate();
    const legendBar: any = [];
    const legendItems: any = [];

    const clearValueInput = (id: string) => {
        const el = (document.getElementById(id) as HTMLInputElement);
        if (el && el.value) { el.value = ''; }
    };

    const insertLegend = (array: any) => {
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
    insertLegend(legend);

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
                                functions.setCountryFilterValue(val);
                                customFunctions.filters({
                                    values: {
                                        ctry: val,
                                        sports: properties.sportFilterValue,
                                        date: properties.dateFilterValue,
                                        name: properties.nameFilterValue
                                    }
                                });
                            }}
                        />
                        <SelectField
                            className="__board_table_filter_item"
                            id="app__historyGroups_selector_sport"
                            options={new OptionsTransformer(sports).get()}
                            onChange={(val: any) => {
                                functions.setSportFilterValue(val);
                                customFunctions.filters({
                                    values: {
                                        ctry: properties.countryFilterValue,
                                        sports: val,
                                        date: properties.dateFilterValue,
                                        name: properties.nameFilterValue
                                    }
                                });
                            }}
                            label="Sport"
                            name="sports"
                        />
                        <div className="__board_table_filter_name_filter">
                            <label>Event Name</label>
                            <input
                                type="text"
                                id="board_table_event_name_input"
                                onChange={(event) => {
                                    functions.setNameFilterValue(event.target.value);
                                }}
                                placeholder={"Enter event name"}
                            />
                        </div>
                        <button
                            onClick={() => {
                                customFunctions.filters({
                                    values: {
                                        ctry: properties.countryFilterValue,
                                        sports: properties.sportFilterValue,
                                        date: properties.dateFilterValue,
                                        name: properties.nameFilterValue
                                    }
                                });
                            }}
                        >Search</button>
                        <button
                            onClick={() => {
                                functions.setNameFilterValue("");
                                customFunctions.filters({
                                    values: {
                                        ctry: properties.countryFilterValue,
                                        sports: properties.sportFilterValue,
                                        date: properties.dateFilterValue,
                                        name: ""
                                    }
                                });
                                clearValueInput("board_table_event_name_input");
                            }}
                        >Clear</button>
                        <div className="__board_table_date_sorters">
                            <button
                                value={"asc"}
                                style={{background: properties.dateFilterValue === "asc" ? "#424242" : "#171719"}}
                                onClick={() => {
                                        functions.setDateFilterValue("asc");
                                        customFunctions.filters({
                                            values: {
                                                ctry: properties.countryFilterValue,
                                                sports: properties.sportFilterValue,
                                                date: "asc",
                                                name: properties.nameFilterValue
                                            }
                                        });
                                }}
                            ><BsSortUpAlt size={"80%"}/></button>
                            <button
                                value={"desc"}
                                style={{background:  properties.dateFilterValue === "desc" ? "#424242" : "#171719"}}
                                onClick={() => {
                                        functions.setDateFilterValue("desc");
                                        customFunctions.filters({
                                            values: {
                                                ctry: properties.countryFilterValue,
                                                sports: properties.sportFilterValue,
                                                date: "desc",
                                                name: properties.nameFilterValue
                                            }
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
                        !properties.maxPage && properties.maxPage !== 0 ?
                        <div className="__board_table_data_loading">
                            <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                            <p>Loading Event History...</p>
                        </div> :
                        !properties.currentPageData ? <div className="__board_table_no_data">No races found</div> :
                        properties.currentPageData && properties.currentPageData.map((item: any, index: number) =>
                            <div
                                className="__board_table_data_item"
                                key={`${index}_board_table_data_item`}
                                onClick={() => {
                                    customFunctions.navigateTo(item);
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
                                                    {width: item_name.customSrc ? "45px" : "35px", height: item_name.customSrc ? "45px" : "26px"}
                                                }
                                                src={item_name.customSrc ? `${item_name.customSrc}${item?.[item_name.data]}.png` : `https://flagcdn.com/${item?.[item_name.data]?.toLowerCase()}.svg`}
                                            /> :
                                            item_name.customElement ? item_name.customElement(item) :
                                            item_name.dataParent ? item?.[item_name.dataParent]?.[item_name.data] : item?.[item_name.data]

                                        }</p>
                                    )
                                }
                            </div>
                        )
                    }
                </div>
            </div>
            {
                properties.maxPage && properties.pageSwitch ?
                <div className="app__historyGroups_pageChange">
                    <button
                        onClick={() => {
                            if (properties.currentPage - 1 !== 0) {
                                functions.currentPage(properties.currentPage - 1);
                                functions.pageData(properties.currentPage - 1);
                            }
                        }}
                    >{`<`}</button>
                    <span>{`${properties.currentPage} / ${properties.maxPage}`}</span>
                    <button
                        onClick={() => {
                            if (properties.currentPage + 1 <= properties.maxPage!) {
                                functions.currentPage(properties.currentPage + 1);
                                functions.pageData(properties.currentPage + 1);
                            }
                        }}
                    >{`>`}</button>
                </div>
                :
                <div className="app__historyGroups_pageChange"/>
            }

        </div>
    );
};