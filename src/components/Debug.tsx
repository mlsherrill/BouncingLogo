import React from 'react';

interface Props {
    colors: string[];
    borderCollisions: { horizontal: number; vertical: number }[];
    scaledWidths: number[];
    scaledHeights: number[];
    tops: number[];
    lefts: number[];
}

export const Debug = ({ colors, borderCollisions, scaledWidths, scaledHeights, tops, lefts }: Props) => {
    return (
        <div className="debug">
            <h2>Debug Information</h2>
            <div className="debug-info">
                {colors.map((color, index) => (
                    <div key={index} className="debug-item">
                        <p>
                            {`Icon ${index + 1} {${String(tops[index]).padStart(4, '0')}, ${String(lefts[index]).padStart(4, '0')}} Size: ${scaledWidths[index]}x${
                                scaledHeights[index]
                            } Color: ${color}`}
                        </p>
                    </div>
                ))}
                <p>
                    Border Collision Horizontal: {borderCollisions[0].horizontal} Border Collision Vertical:{' '}
                    {borderCollisions[0].vertical}
                </p>{' '}
            </div>
        </div>
    );
};
