import React from 'react';
import { BorderCollision } from '../types';

interface Props {
    colors: string[];
    borderCollisions: BorderCollision[];
    scaledWidths: number[];
    scaledHeights: number[];
    tops: number[];
    lefts: number[];
    isVisible: boolean;
    setIsPaused: React.Dispatch<React.SetStateAction<boolean>>;
    setShouldStopOnCollision: React.Dispatch<React.SetStateAction<boolean>>;
    advanceOneStep: () => void;
}

export const Debug = ({
    colors,
    borderCollisions,
    scaledWidths,
    scaledHeights,
    tops,
    lefts,
    isVisible,
    setIsPaused,
    setShouldStopOnCollision,
    advanceOneStep,
}: Props) => {
    if (!isVisible) {
        return null;
    }
    return (
        <div className="debug">
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: window.innerWidth - 600,
                    minWidth: '100px',
                    minHeight: '100px',
                    backgroundColor: isVisible ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                    zIndex: 10,
                }}
            >
                <h2>Debug Information</h2>
                <div className="debug-info">
                    {colors.map((color, index) => (
                        <div key={index} className="debug-item">
                            <p>
                                {`Icon ${index} {${String(tops[index]).padStart(6, '0')}, ${String(
                                    lefts[index]
                                ).padStart(6, '0')}} Size: ${scaledWidths[index]}x${
                                    scaledHeights[index]
                                } Color: ${color}`}
                            </p>
                        </div>
                    ))}
                    <p>
                        Border Collision Right: {borderCollisions[0].right} Border Collision Bottom:{' '}
                        {borderCollisions[0].bottom}
                    </p>
                    <button onClick={() => setIsPaused((prev: boolean) => !prev)}>Pause</button>
                    <button onClick={() => setShouldStopOnCollision(prev => !prev)}>Stop On Collision</button>
                    <button onClick={advanceOneStep}>One Step</button>
                </div>
            </div>
        </div>
    );
};
