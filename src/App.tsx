import { useReducer, useRef, useState } from 'react';
import './App.css';
import { Debug } from './components/Debug';

import { TH_ICON, TP_ICON } from './constants';
import { useDimensions } from './hooks/useDimensions';
import { useQuery } from './hooks/useQuery';
import { ConfigMenu } from './components/ConfigMenu';

function App() {
    const query = useQuery();
    const [isDebugVisible, setIsDebugVisible] = useState(query.debug === 'true');
    const [speedMultiplier, setSpeedMultiplier] = useState(query.speed ? parseFloat(query.speed) : 1);
    const [numberOfIcons, setNumberOfIcons] = useState(query.number || query.n ? parseInt(query.number || query.n) : 1);
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    const [svgIcons, setSvgIcons] = useState(() => {
        const newSvgIcons = [];
        for (let i = 0; i < numberOfIcons; i++) {
            newSvgIcons.push(i % 2 === 0 ? TH_ICON : TP_ICON);
        }
        return newSvgIcons;
    });

    const { colors, positions, borderCollisions, setIsPaused, moveLogos, setShouldStopOnCollision } = useDimensions(
        svgIcons,
        speedMultiplier
    );

    const addIcon = () => {
        const newIcon = numberOfIcons % 2 === 0 ? TH_ICON : TP_ICON;
        setSvgIcons(prev => [...prev, newIcon]);
        setNumberOfIcons(prev => prev + 1);
    };
    const removeIcon = () => {
        if (numberOfIcons > 1) {
            setSvgIcons(prev => prev.slice(0, -1));
            setNumberOfIcons(prev => prev - 1);
        }
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current) {
            clearTimeout(hoverTimeout.current);
        }
        hoverTimeout.current = setTimeout(() => {
            setIsMenuVisible(false);
        }, 1000);
    };

    return (
        <div className="App">
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    minWidth: '100px',
                    minHeight: '400px',
                    backgroundColor: isMenuVisible ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                    zIndex: 10,
                }}
                onMouseEnter={() => setIsMenuVisible(true)}
                onMouseLeave={handleMouseLeave}
            >
                {isMenuVisible && (
                    <ConfigMenu
                        speedMultiplier={speedMultiplier}
                        numberOfIcons={numberOfIcons}
                        addIcon={addIcon}
                        removeIcon={removeIcon}
                        setSpeedMultiplier={setSpeedMultiplier}
                        setIsPaused={setIsPaused}
                        setIsDebugVisible={setIsDebugVisible}
                    />
                )}
            </div>
            {svgIcons.map((icon, index) => {
                const IconComponent = icon.component;
                if (positions[index] === undefined) {
                    return null;
                }
                return (
                    <IconComponent
                        key={index}
                        color={colors[index]}
                        position={positions[index]}
                        debug={isDebugVisible}
                        index={index}
                    />
                );
            })}
            <Debug
                colors={colors}
                borderCollisions={borderCollisions}
                scaledWidths={svgIcons.map(icon => icon.width * icon.scale)}
                scaledHeights={svgIcons.map(icon => icon.height * icon.scale)}
                tops={positions.map(pos => pos.top)}
                lefts={positions.map(pos => pos.left)}
                isVisible={isDebugVisible}
                setIsPaused={setIsPaused}
                setShouldStopOnCollision={setShouldStopOnCollision}
                advanceOneStep={moveLogos}
            />
        </div>
    );
}

export default App;
