import { useState } from 'react';
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

    const [svgIcons, setSvgIcons] = useState(() => {
        const newSvgIcons = [];
        for (let i = 0; i < numberOfIcons; i++) {
            newSvgIcons.push(i % 2 === 0 ? TH_ICON : TP_ICON);
        }
        return newSvgIcons;
    });

    const { colors, positions, borderCollisions, setIsPaused, moveLogos, setShouldStopOnCollision } = useDimensions(
        svgIcons,
        speedMultiplier,
        isDebugVisible
    );

    return (
        <div className="App">
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    minWidth: '100px',
                    minHeight: '100px',
                    backgroundColor: isMenuVisible ? 'rgba(0, 0, 0, 0.5)' : 'transparent',
                    zIndex: 10,
                }}
                onMouseEnter={() => setIsMenuVisible(true)}
                onMouseLeave={() => setTimeout(() => setIsMenuVisible(false), 2000)}
            >
                {isMenuVisible && (
                    <ConfigMenu
                        speedMultiplier={speedMultiplier}
                        numberOfIcons={numberOfIcons}
                        setNumberOfIcons={setNumberOfIcons}
                        setSpeedMultiplier={setSpeedMultiplier}
                        setIsPaused={setIsPaused}
                        setIsDebugVisible={setIsDebugVisible}
                    />
                )}
            </div>
            {svgIcons.map((icon, index) => {
                const IconComponent = icon.component;

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

            {isDebugVisible && (
                <Debug
                    colors={colors}
                    borderCollisions={borderCollisions}
                    scaledWidths={svgIcons.map(icon => icon.width * icon.scale)}
                    scaledHeights={svgIcons.map(icon => icon.height * icon.scale)}
                    tops={positions.map(pos => pos.top)}
                    lefts={positions.map(pos => pos.left)}
                />
            )}
            {isDebugVisible && (
                <>
                    <button onClick={() => setIsPaused(prev => !prev)}>Pause</button>
                    <button onClick={() => setShouldStopOnCollision(prev => !prev)}>Stop On Collision</button>
                    <button onClick={moveLogos}>One Step</button>
                </>
            )}
        </div>
    );
}

export default App;
