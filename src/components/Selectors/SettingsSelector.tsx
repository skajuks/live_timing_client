import React from 'react';

interface SettingsSelectorProps {
    onAutoScrollChange: Function;
    startScrollAnimation: Function; // Assuming this function is defined in the parent
}

const SettingsSelector: React.FC<SettingsSelectorProps> = (
    {
        onAutoScrollChange,
        startScrollAnimation,
    }
    ) => {
    
    function handleAutoScrollChange(event: React.ChangeEvent<HTMLInputElement>) {
        const isChecked = event.target.checked;
        onAutoScrollChange(isChecked);
        if (isChecked) startScrollAnimation();
    };

    return (
        <div className="app_liveList-top-selector">
            <div className="app__liveList-top-settings-autoscroll">
                <header>Autoscroll</header>
                <div className="app__liveList-top-settings-autoscroll-item">
                    <header>Enabled</header>
                    <input 
                        type="checkbox"
                        onChange={handleAutoScrollChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsSelector;