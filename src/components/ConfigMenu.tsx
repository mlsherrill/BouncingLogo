import React from 'react';

interface Props {
    setNumberOfIcons: React.Dispatch<React.SetStateAction<number>>;
    setSpeedMultiplier: React.Dispatch<React.SetStateAction<number>>;
    setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
    setIsDebugVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ConfigMenu = ({ setNumberOfIcons, setSpeedMultiplier, setIsPaused, setIsDebugVisible }: Props) => {
    return (
        <div className="config-menu">
            <h2>Icons</h2>
            <button onClick={() => setNumberOfIcons(prev => prev + 1)}>Add</button>
            <button onClick={() => setNumberOfIcons(prev => Math.max(prev - 1, 0))}>Remove</button>
            <h2>Speed</h2>
            <button onClick={() => setSpeedMultiplier(prev => prev - 0.5)}>-</button>
            <button onClick={() => setSpeedMultiplier(prev => prev + 0.5)}>+</button>
            <h2>Pause</h2>
            <button onClick={() => setIsPaused(prev => !prev)}>Toggle</button>
            <h2>Debug</h2>
            <button onClick={() => setIsDebugVisible(prev => !prev)}>Toggle</button>
        </div>
    );
};
