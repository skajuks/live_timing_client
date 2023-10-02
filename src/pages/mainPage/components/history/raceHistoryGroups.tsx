import "./raceHistoryGroups.scss";
import { useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { BoardTable } from "../../../../components/ScoreboardTable";
import Select from "react-select";


const countries = {
    AF: 'Afghanistan',
    AX: 'Aland Islands',
    AL: 'Albania',
    DZ: 'Algeria',
    AS: 'American Samoa',
    AD: 'Andorra',
    AO: 'Angola',
    AI: 'Anguilla',
    AQ: 'Antarctica',
    AG: 'Antigua And Barbuda',
    AR: 'Argentina',
    AM: 'Armenia',
    AW: 'Aruba',
    AU: 'Australia',
    AT: 'Austria',
    AZ: 'Azerbaijan',
    BS: 'Bahamas',
    BH: 'Bahrain',
    BD: 'Bangladesh',
    BB: 'Barbados',
    BY: 'Belarus',
    BE: 'Belgium',
    BZ: 'Belize',
    BJ: 'Benin',
    BM: 'Bermuda',
    BT: 'Bhutan',
    BO: 'Bolivia',
    BA: 'Bosnia And Herzegovina',
    BW: 'Botswana',
    BV: 'Bouvet Island',
    BR: 'Brazil',
    IO: 'British Indian Ocean Territory',
    BN: 'Brunei Darussalam',
    BG: 'Bulgaria',
    BF: 'Burkina Faso',
    BI: 'Burundi',
    KH: 'Cambodia',
    CM: 'Cameroon',
    CA: 'Canada',
    CV: 'Cape Verde',
    KY: 'Cayman Islands',
    CF: 'Central African Republic',
    TD: 'Chad',
    CL: 'Chile',
    CN: 'China',
    CX: 'Christmas Island',
    CC: 'Cocos (Keeling) Islands',
    CO: 'Colombia',
    KM: 'Comoros',
    CG: 'Congo',
    CD: 'Congo, Democratic Republic',
    CK: 'Cook Islands',
    CR: 'Costa Rica',
    CI: 'Cote D\'Ivoire',
    HR: 'Croatia',
    CU: 'Cuba',
    CY: 'Cyprus',
    CZ: 'Czech Republic',
    DK: 'Denmark',
    DJ: 'Djibouti',
    DM: 'Dominica',
    DO: 'Dominican Republic',
    EC: 'Ecuador',
    EG: 'Egypt',
    SV: 'El Salvador',
    GQ: 'Equatorial Guinea',
    ER: 'Eritrea',
    EE: 'Estonia',
    ET: 'Ethiopia',
    FK: 'Falkland Islands (Malvinas)',
    FO: 'Faroe Islands',
    FJ: 'Fiji',
    FI: 'Finland',
    FR: 'France',
    GF: 'French Guiana',
    PF: 'French Polynesia',
    TF: 'French Southern Territories',
    GA: 'Gabon',
    GM: 'Gambia',
    GE: 'Georgia',
    DE: 'Germany',
    GH: 'Ghana',
    GI: 'Gibraltar',
    GR: 'Greece',
    GL: 'Greenland',
    GD: 'Grenada',
    GP: 'Guadeloupe',
    GU: 'Guam',
    GT: 'Guatemala',
    GG: 'Guernsey',
    GN: 'Guinea',
    GW: 'Guinea-Bissau',
    GY: 'Guyana',
    HT: 'Haiti',
    HM: 'Heard Island & Mcdonald Islands',
    VA: 'Holy See (Vatican City State)',
    HN: 'Honduras',
    HK: 'Hong Kong',
    HU: 'Hungary',
    IS: 'Iceland',
    IN: 'India',
    ID: 'Indonesia',
    IR: 'Iran, Islamic Republic Of',
    IQ: 'Iraq',
    IE: 'Ireland',
    IM: 'Isle Of Man',
    IL: 'Israel',
    IT: 'Italy',
    JM: 'Jamaica',
    JP: 'Japan',
    JE: 'Jersey',
    JO: 'Jordan',
    KZ: 'Kazakhstan',
    KE: 'Kenya',
    KI: 'Kiribati',
    KR: 'Korea',
    KW: 'Kuwait',
    KG: 'Kyrgyzstan',
    LA: 'Lao People\'s Democratic Republic',
    LV: 'Latvia',
    LB: 'Lebanon',
    LS: 'Lesotho',
    LR: 'Liberia',
    LY: 'Libyan Arab Jamahiriya',
    LI: 'Liechtenstein',
    LT: 'Lithuania',
    LU: 'Luxembourg',
    MO: 'Macao',
    MK: 'Macedonia',
    MG: 'Madagascar',
    MW: 'Malawi',
    MY: 'Malaysia',
    MV: 'Maldives',
    ML: 'Mali',
    MT: 'Malta',
    MH: 'Marshall Islands',
    MQ: 'Martinique',
    MR: 'Mauritania',
    MU: 'Mauritius',
    YT: 'Mayotte',
    MX: 'Mexico',
    FM: 'Micronesia, Federated States Of',
    MD: 'Moldova',
    MC: 'Monaco',
    MN: 'Mongolia',
    ME: 'Montenegro',
    MS: 'Montserrat',
    MA: 'Morocco',
    MZ: 'Mozambique',
    MM: 'Myanmar',
    NA: 'Namibia',
    NR: 'Nauru',
    NP: 'Nepal',
    NL: 'Netherlands',
    AN: 'Netherlands Antilles',
    NC: 'New Caledonia',
    NZ: 'New Zealand',
    NI: 'Nicaragua',
    NE: 'Niger',
    NG: 'Nigeria',
    NU: 'Niue',
    NF: 'Norfolk Island',
    MP: 'Northern Mariana Islands',
    NO: 'Norway',
    OM: 'Oman',
    PK: 'Pakistan',
    PW: 'Palau',
    PS: 'Palestinian Territory, Occupied',
    PA: 'Panama',
    PG: 'Papua New Guinea',
    PY: 'Paraguay',
    PE: 'Peru',
    PH: 'Philippines',
    PN: 'Pitcairn',
    PL: 'Poland',
    PT: 'Portugal',
    PR: 'Puerto Rico',
    QA: 'Qatar',
    RE: 'Reunion',
    RO: 'Romania',
    RU: 'Russian Federation',
    RW: 'Rwanda',
    BL: 'Saint Barthelemy',
    SH: 'Saint Helena',
    KN: 'Saint Kitts And Nevis',
    LC: 'Saint Lucia',
    MF: 'Saint Martin',
    PM: 'Saint Pierre And Miquelon',
    VC: 'Saint Vincent And Grenadines',
    WS: 'Samoa',
    SM: 'San Marino',
    ST: 'Sao Tome And Principe',
    SA: 'Saudi Arabia',
    SN: 'Senegal',
    RS: 'Serbia',
    SC: 'Seychelles',
    SL: 'Sierra Leone',
    SG: 'Singapore',
    SK: 'Slovakia',
    SI: 'Slovenia',
    SB: 'Solomon Islands',
    SO: 'Somalia',
    ZA: 'South Africa',
    GS: 'South Georgia And Sandwich Isl.',
    ES: 'Spain',
    LK: 'Sri Lanka',
    SD: 'Sudan',
    SR: 'Suriname',
    SJ: 'Svalbard And Jan Mayen',
    SZ: 'Swaziland',
    SE: 'Sweden',
    CH: 'Switzerland',
    SY: 'Syrian Arab Republic',
    TW: 'Taiwan',
    TJ: 'Tajikistan',
    TZ: 'Tanzania',
    TH: 'Thailand',
    TL: 'Timor-Leste',
    TG: 'Togo',
    TK: 'Tokelau',
    TO: 'Tonga',
    TT: 'Trinidad And Tobago',
    TN: 'Tunisia',
    TR: 'Turkey',
    TM: 'Turkmenistan',
    TC: 'Turks And Caicos Islands',
    TV: 'Tuvalu',
    UG: 'Uganda',
    UA: 'Ukraine',
    AE: 'United Arab Emirates',
    GB: 'United Kingdom',
    US: 'United States',
    UM: 'United States Outlying Islands',
    UY: 'Uruguay',
    UZ: 'Uzbekistan',
    VU: 'Vanuatu',
    VE: 'Venezuela',
    VN: 'Viet Nam',
    VG: 'Virgin Islands, British',
    VI: 'Virgin Islands, U.S.',
    WF: 'Wallis And Futuna',
    EH: 'Western Sahara',
    YE: 'Yemen',
    ZM: 'Zambia',
    ZW: 'Zimbabwe'
};

interface RaceHistoryData {
    id: number;
    event_name: string;
    event_track_name: string;
    event_date: string;
    event_country: string;
    event_sport: number;
}

interface RaceHistoryElement {
    data: RaceHistoryData[];
    current_page: number;
};

const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function parseDate(dateString: string) {
    const dateParts = dateString.split("-");
    const year = Number(dateParts[0]);
    const month = Number(dateParts[1]);
    const day = Number(dateParts[2]);

    // Create a new Date object from the parsed parts
    const date = new Date(year, month - 1, day);
    // Get the abbreviated month name
    const abbreviatedMonth = monthNames[date.getMonth()];
    return `${abbreviatedMonth} ${day}, ${year}`;
};

class OptionsTransformer {
    obj: Object;
    constructor(obj: Object) {
        this.obj = obj;
    }
    get(obj: any) {
        const out = [];
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
              const label = obj[key];
              out.push({value: key, label: label});
            }
        }
        return out;
    };
    transformer() {
        return this.get(this.obj);
    }
};

const sports = {
    1: "Car Racing",
    2: "Motorcycle Racing",
    3: "Supermoto",
    4: "Karting",
    5: "Motocross",
    6: "Autocross",
    7: "Rallycross",
    8: "Off-road (motorcycles)",
    9: "Off-road (cars)",
    10: "Endurance (motorcycles)",
    11: "Endurance (cars)",
    12: "Other Racing"
};

export const RaceHistoryGroups = () => {

    const [maxPage, setMaxPage] = useState(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [currentPageData, setCurrentPageData] = useState<RaceHistoryElement>();

    const [countryFilterValue, setCountryFilterValue] = useState<string>();
    const [sportFilterValue, setSportFilterValue] = useState<string | null>();

    const getDataOnFilterChange = async () => {

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
    }, [maxPage]);

    useEffect(() => {
        if (!currentPage || !maxPage) { return; }
        getPageData(currentPage);
    }, [maxPage, currentPage])

    return (
        <div className="app__historyGroups_main">
            <header>
                <h3>Event History</h3>
                <p>Click on a event to view more info about event runs and results.</p>
                <div className="app__historyGroups_data_filter">
                    <span>Filters</span>
                    <div className="app__historyGroups_data_filter_content">
                        <Select
                            id="app__historyGroups_selector_country"
                            options={new OptionsTransformer(countries).transformer()}
                        />
                        <Select
                            id="app__historyGroups_selector_sport"
                            options={new OptionsTransformer(sports).transformer()}
                            onChange={(val) => { setSportFilterValue(val!.value) }}
                        />
                    </div>
                </div>
            </header>
            <div className="app__historyGroups_data">
                <BoardTable
                    legend={[
                        {data: "event_sport", name: "Type", width: 5, img: false, center: true},
                        {data: "event_country", name: "State", width: 5, img: true, center: true},
                        {data: "event_name", name: "Event Name", width: 40, img: false, center: false},
                        {data: "event_track_name", name: "Track Name", width: 40, img: false, center: false},
                        {data: "parsed_date", name: "Date", width: 10, img: false, center: true}
                    ]}
                    data={currentPageData && currentPageData.data}
                    properties={{}}
                />
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