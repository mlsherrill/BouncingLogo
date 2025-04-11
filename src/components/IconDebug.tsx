import { Position } from '../types';

interface Props {
    index: number;
    position: Position;
    scaledWidth: number;
    scaledHeight: number;
}

export const IconDebug = ({ index, position, scaledHeight, scaledWidth }: Props) => {
    return (
        <div
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
        >
            <text x="5%" y="10%" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="6">
                {index}
            </text>
            <text x="50%" y="10%" textAnchor="right" dominantBaseline="middle" fill="white" fontSize="6">
                {position.top}
            </text>
            <text x="75%" y="50%" textAnchor="right" dominantBaseline="middle" fill="white" fontSize="6">
                {position.left + scaledWidth}
            </text>
            <text x="50%" y="85%" textAnchor="right" dominantBaseline="middle" fill="white" fontSize="6">
                {position.top + scaledHeight}
            </text>
            <text x="20%" y="50%" textAnchor="right" dominantBaseline="middle" fill="white" fontSize="6">
                {position.left}
            </text>
        </div>
    );
};
