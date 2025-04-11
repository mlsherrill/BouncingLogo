import React from 'react';
import './ConfigMenu.css';

interface Props {
    speedMultiplier: number;
    numberOfIcons: number;
    addIcon: () => void;
    removeIcon: () => void;
    setSpeedMultiplier: React.Dispatch<React.SetStateAction<number>>;
    setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
    setIsDebugVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConfigMenu = ({
    speedMultiplier,
    numberOfIcons,
    addIcon,
    removeIcon,
    setSpeedMultiplier,
    setIsPaused,
    setIsDebugVisible,
}: Props) => {
    const handleSpeedDecrease = () => {
        if (speedMultiplier <= 0) {
            return;
        }
        if (speedMultiplier - 0.5 < 0) {
            setSpeedMultiplier(0);
            return;
        }
        setSpeedMultiplier(prev => prev - 0.5);
    };

    return (
        <div className="config-menu">
            <h2>Icons: {numberOfIcons}</h2>
            <button onClick={removeIcon}>Remove</button>
            <button onClick={addIcon}>Add</button>
            <h2>Speed: {speedMultiplier}</h2>
            <button onClick={handleSpeedDecrease}>Slower</button>
            <button onClick={() => setSpeedMultiplier(prev => prev + 0.5)}>Faster</button>
            <h2>Pause</h2>
            <button onClick={() => setIsPaused(prev => !prev)}>Toggle</button>
            <h2>Debug</h2>
            <button onClick={() => setIsDebugVisible(prev => !prev)}>Toggle</button>
        </div>
    );
};
