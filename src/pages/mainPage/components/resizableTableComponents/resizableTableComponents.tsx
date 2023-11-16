import { getPositionArrow } from "../../../../helpers/Functions";

const ResizableTablePosMobileComponent = (props: any) => {
    return (
        <div className="resized_position_wrapper_mobile">
            <p>{props.data}</p>
        </div>
    );
};
const ResizableTableSurnameMobileComponent = (props: any) => {
    return (
        <span className="resized_position_surname_mobile">{props?.data}</span>
    );
};
const ResizableTableSurnameComponent = (props: any) => {
    return (
        <span className="resized_position_surname">{props?.data}</span>
    );
};
const ResizableTablePosComponent = (props: any) => {
    return (
        <div className="resized_position_wrapper_mobile">
            <p>{props.data}</p>
        </div>
    );
};
const ResizableTableImgComponent = (props: any) => {
    if (!props.data) { return; }
    return (
        <img src={`https://flagcdn.com/${props.data?.toLowerCase()}.svg`} alt={props.name}/>
    );
};
const ResizableTableStatusComponent = (props: any) => {
    if (!props.data) { return; }
    return ( getPositionArrow(props.data) );
};
const ResizableTableFastestLapComponent = (props: any) => {
    const isFastest = props.data === props.fastest?.best_lap_time;
    return (
        <p style={{
            color: isFastest ? "#c44df0" : "#51f6ff",
            fontWeight: isFastest ? "800" : "100",
            marginLeft: "5px"
        }}>{props.data}</p>
    );
};
const ResizableTableStartNrComponent = (props: any) => {
    if (!props.data) { return; }
    return ( <p className="resized_start_nr">{props.data}</p> );
};

export {
    ResizableTableFastestLapComponent,
    ResizableTableImgComponent,
    ResizableTablePosComponent,
    ResizableTablePosMobileComponent,
    ResizableTableStatusComponent,
    ResizableTableSurnameComponent,
    ResizableTableSurnameMobileComponent,
    ResizableTableStartNrComponent
}