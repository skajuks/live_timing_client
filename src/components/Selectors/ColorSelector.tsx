import React from 'react';

interface ColorSelectorProps {
    selectedColors: string[];
    saveCallback: (colors: string[]) => void;
    resetCallback: () => void;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({selectedColors, saveCallback, resetCallback}) => {

    function getSelectedColors(): string[] {
        return [
            (document.getElementById("input__color-prim") as HTMLInputElement)?.value,
            (document.getElementById("input__color-sec") as HTMLInputElement)?.value,
        ];
    };

    return (
        <div className="app_liveList-top-selector">
            <div className="app_liveList-color-selector-item">
                <header>Primary</header>
                <input type="color" id="input__color-prim" defaultValue={selectedColors[0]} />
            </div>
            <div className="app_liveList-color-selector-item">
                <header>Secondary</header>
                <input type="color" id="input__color-sec" defaultValue={selectedColors[1]} />
            </div>
            <div className="app_liveList-color-selector-btns">
                <button onClick={() => { saveCallback(getSelectedColors()) }}>Save colors</button>
                <button onClick={() => { resetCallback() }}>Reset to default</button>
            </div>
        </div>
    );
};

export default ColorSelector;