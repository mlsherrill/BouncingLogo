import React from 'react';

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
    return (
        <div className="config-menu">
            <h2>Icons: {numberOfIcons}</h2>
            <button onClick={addIcon}>Add</button>
            <button onClick={removeIcon}>Remove</button>
            <h2>Speed: {speedMultiplier}</h2>
            <button onClick={() => setSpeedMultiplier(prev => prev - 0.5)}>-</button>
            <button onClick={() => setSpeedMultiplier(prev => prev + 0.5)}>+</button>
            <h2>Pause</h2>
            <button onClick={() => setIsPaused(prev => !prev)}>Toggle</button>
            <h2>Debug</h2>
            <button onClick={() => setIsDebugVisible(prev => !prev)}>Toggle</button>
        </div>
    );
};
