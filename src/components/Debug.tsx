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
                        <p>Icon {index + 1}</p>
                        <p>Color: {color}</p>
                        <p>Top: {tops[index]}</p>
                        <p>Left: {lefts[index]}</p>
                        <p>Width: {scaledWidths[index]}</p>
                        <p>Height: {scaledHeights[index]}</p>
                        <p>Border Collision Horizontal: {borderCollisions[index].horizontal}</p>
                        <p>Border Collision Vertical: {borderCollisions[index].vertical}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
