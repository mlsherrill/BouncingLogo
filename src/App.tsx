import { useState } from 'react';
import './App.css';
import { Debug } from './components/Debug';

import { TH_ICON, TP_ICON } from './constants';
import { useDimensions } from './hooks/useDimensions';
import { useQuery } from './hooks/useQuery';

function App() {
    const query = useQuery();
    const showDebug = query.debug === 'true';
    const [speedMultiplier, setSpeedMultiplier] = useState(query.speed ? parseFloat(query.speed) : 1);
    const numberOfIcons = query.number || query.n ? parseInt(query.number || query.n) : 1;

    const svgIcons = [TH_ICON, TP_ICON];

    if (numberOfIcons > 2) {
        for (let i = 2; i < numberOfIcons; i++) {
            svgIcons.push(svgIcons[i % 2]);
        }
    }
    const { colors, tops, lefts, borderCollisions, setIsPaused, moveLogos, setFullStopDebug } = useDimensions(
        svgIcons,
        speedMultiplier,
        showDebug
    );

    return (
        <div className="App">
            {svgIcons.map((icon, index) => {
                const IconComponent = icon.component;

                return (
                    <IconComponent
                        color={colors[index]}
                        top={tops[index]}
                        left={lefts[index]}
                        debug={showDebug}
                        index={index}
                    />
                );
            })}

            {showDebug && (
                <Debug
                    colors={colors}
                    borderCollisions={borderCollisions}
                    scaledWidths={svgIcons.map(icon => icon.width * icon.scale)}
                    scaledHeights={svgIcons.map(icon => icon.height * icon.scale)}
                    tops={tops}
                    lefts={lefts}
                />
            )}
            {showDebug && (
                <>
                    <button onClick={() => setSpeedMultiplier(prev => prev - 0.5)}>-Speed</button>
                    <button onClick={() => setSpeedMultiplier(prev => prev + 0.5)}>+Speed</button>
                    <button onClick={() => setIsPaused(prev => !prev)}>Pause</button>
                    <button onClick={() => setFullStopDebug(prev => !prev)}>Full Stop</button>
                    <button onClick={moveLogos}>One Step</button>
                </>
            )}
        </div>
    );
}

export default App;
