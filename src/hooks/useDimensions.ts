/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

interface BorderCollision {
    horizontal: number;
    vertical: number;
}

interface IconLocation {
    top: number;
    left: number;
    bottom: number;
    right: number;
}

interface Velocity {
    topSpeed: number;
    leftSpeed: number;
}

const DEFAULT_TOP_SPEED = 1;
const DEFAULT_LEFT_SPEED = 2;

export const useDimensions = (
    icons: { width: number; height: number; scale: number }[],
    speedMultiplier: number,
    debug: boolean = false
) => {
    const [isPaused, setIsPaused] = useState(false);
    const [shouldStopOnCollision, setShouldStopOnCollision] = useState(false);
    const [initialVelocities, setInitialVelocities] = useState<Velocity[]>([]);

    const getRandomNumber = (min: number, max: number) => {
        return Math.floor(Math.random() * (max - min)) + min;
    };
    const getRandomColor = () => {
        const red = getRandomNumber(100, 256);
        const green = getRandomNumber(100, 256);
        const blue = getRandomNumber(100, 256);
        return `rgb(${red}, ${green}, ${blue})`;
    };

    const [colors, setColors] = useState(() => {
        const colors: string[] = [];
        for (let i = 0; i < icons.length; i++) {
            const color = getRandomColor();
            colors.push(color);
        }
        return colors;
    });

    const getScaledWidths = () => {
        const widths: number[] = [];
        for (let i = 0; i < icons.length; i++) {
            const scaledWidth = icons[i].width * icons[i].scale;
            widths.push(scaledWidth);
        }
        return widths;
    };
    const getScaledHeights = () => {
        const heights: number[] = [];
        for (let i = 0; i < icons.length; i++) {
            const scaledHeight = icons[i].height * icons[i].scale;
            heights.push(scaledHeight);
        }
        return heights;
    };

    const scaledWidths = getScaledWidths();
    const scaledHeights = getScaledHeights();
    const getBorderCollisions = () => {
        const borderCollisions: BorderCollision[] = [];
        for (let i = 0; i < icons.length; i++) {
            const borderCollision: BorderCollision = {
                horizontal: window.innerWidth - scaledWidths[i],
                vertical: window.innerHeight - scaledHeights[i],
            };
            borderCollisions.push(borderCollision);
        }
        return borderCollisions;
    };

    const [borderCollisions, setBorderCollisions] = useState(getBorderCollisions());

    const [positions, setPositions] = useState(() => {
        const positions: { top: number; left: number }[] = [];

        for (let i = 0; i < icons.length; i++) {
            let isOverlapping;
            let top: number;
            let left: number;
            do {
                top = getRandomNumber(0, borderCollisions[i].vertical);
                left = getRandomNumber(0, borderCollisions[i].horizontal);
                // eslint-disable-next-line no-loop-func
                isOverlapping = positions.some((existingPosition, index) => {
                    const existingBottom = existingPosition.top + scaledHeights[index];
                    const existingRight = existingPosition.left + scaledWidths[index];
                    const newBottom = top + scaledHeights[i];
                    const newRight = left + scaledWidths[i];

                    return (
                        top < existingBottom &&
                        newBottom > existingPosition.top &&
                        left < existingRight &&
                        newRight > existingPosition.left
                    );
                });
            } while (isOverlapping);

            positions.push({ top, left });
        }

        return positions;
    });

    const getRandomVelocity = () => {
        const availableTopSpeeds = [-DEFAULT_TOP_SPEED * speedMultiplier, DEFAULT_TOP_SPEED * speedMultiplier];
        const availableLeftSpeeds = [-DEFAULT_LEFT_SPEED * speedMultiplier, DEFAULT_LEFT_SPEED * speedMultiplier];
        const topSpeedIndex = Math.floor(Math.random() * availableTopSpeeds.length);
        const leftSpeedIndex = Math.floor(Math.random() * availableLeftSpeeds.length);
        return {
            topSpeed: availableTopSpeeds[topSpeedIndex],
            leftSpeed: availableLeftSpeeds[leftSpeedIndex],
        };
    };

    const [velocities, setVelocities] = useState(() => {
        const velocities: Velocity[] = [];
        for (let i = 0; i < icons.length; i++) {
            velocities.push(getRandomVelocity());
        }

        setInitialVelocities(velocities);
        return velocities;
    });
    const getDimensions = () => {
        setBorderCollisions(getBorderCollisions());
    };

    const moveLogos = () => {
        const newPositions = [...positions];
        const newVelocities = [...velocities];
        const newColors = [...colors];
        const hasChangedColor = Array(icons.length).fill(false);
        for (let i = 0; i < icons.length; i++) {
            const { top, left, topSpeed, leftSpeed, color } = moveLogo(i, newPositions, newVelocities, newColors);
            newPositions[i] = { top, left };

            newVelocities[i].topSpeed = topSpeed;
            newVelocities[i].leftSpeed = leftSpeed;
            newColors[i] = color;
            for (let j = 0; j < icons.length; j++) {
                if (i === j) continue;

                // Check for collision with other logos
                const iconLocation: IconLocation = {
                    top: newPositions[i].top,
                    left: newPositions[i].left,
                    bottom: newPositions[i].top + scaledHeights[i],
                    right: newPositions[i].left + scaledWidths[i],
                };
                const otherIconLocation: IconLocation = {
                    top: newPositions[j].top,
                    left: newPositions[j].left,
                    bottom: newPositions[j].top + scaledHeights[j],
                    right: newPositions[j].left + scaledWidths[j],
                };
                if (
                    iconLocation.top < otherIconLocation.bottom &&
                    iconLocation.bottom > otherIconLocation.top &&
                    iconLocation.left < otherIconLocation.right &&
                    iconLocation.right > otherIconLocation.left
                ) {
                    if (shouldStopOnCollision) debugger;

                    const deltaX = iconLocation.left - otherIconLocation.left;
                    const deltaY = iconLocation.top - otherIconLocation.top;
                    const absDeltaX = Math.abs(deltaX);
                    const absDeltaY = Math.abs(deltaY);

                    const isVerticalCollision = absDeltaY > absDeltaX;
                    const isHorizontalCollision = absDeltaX > absDeltaY;
                    const shouldColorChange = isHorizontalCollision || isVerticalCollision;

                    if (isVerticalCollision) {
                        newVelocities[i].topSpeed = -newVelocities[i].topSpeed;
                        newVelocities[j].topSpeed = -newVelocities[j].topSpeed;
                    }
                    if (isHorizontalCollision) {
                        newVelocities[i].leftSpeed = -newVelocities[i].leftSpeed;
                        newVelocities[j].leftSpeed = -newVelocities[j].leftSpeed;
                    }
                    if (shouldColorChange) {
                        newColors[i] = !hasChangedColor[i] ? getRandomColor() : newColors[i];
                        newColors[j] = !hasChangedColor[j] ? getRandomColor() : newColors[j];
                        hasChangedColor[i] = true;
                        hasChangedColor[j] = true;
                    }
                }
            }
        }
        setPositions(newPositions);
        setVelocities(newVelocities);
        setColors(newColors);
    };

    const moveLogo = (
        index: number,
        newPositions: { top: number; left: number }[],
        newVelocities: Velocity[],
        newColors: string[]
    ) => {
        let newTop = newPositions[index].top + newVelocities[index].topSpeed;
        let newLeft = newPositions[index].left + newVelocities[index].leftSpeed;
        let topSpeed = newVelocities[index].topSpeed;
        let leftSpeed = newVelocities[index].leftSpeed;
        let newColor = newColors[index];

        if (newTop >= borderCollisions[index].vertical) {
            topSpeed = -topSpeed;
            newColor = getRandomColor();
            newTop = borderCollisions[index].vertical;
        }
        if (newTop <= 0) {
            topSpeed = -topSpeed;
            newColor = getRandomColor();
            newTop = 0;
        }
        if (newLeft >= borderCollisions[index].horizontal) {
            leftSpeed = -leftSpeed;
            newColor = getRandomColor();
            newLeft = borderCollisions[index].horizontal;
        }
        if (newLeft <= 0) {
            leftSpeed = -leftSpeed;
            newColor = getRandomColor();
            newLeft = 0;
        }

        return {
            top: newTop,
            left: newLeft,
            topSpeed: topSpeed,
            leftSpeed: leftSpeed,
            color: newColor,
        };
    };

    useEffect(() => {
        window.addEventListener('resize', getDimensions);

        return () => {
            window.removeEventListener('resize', getDimensions);
        };
    });

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (isPaused) return;
            moveLogos();
        }, 16);

        return () => {
            clearTimeout(timeout);
        };
    }, [isPaused, moveLogos]);

    useEffect(() => {
        console.log('Speed multiplier updated:', speedMultiplier);
        setVelocities(() => {
            const newVelocities: Velocity[] = [];

            for (let i = 0; i < icons.length; i++) {
                const { topSpeed: initialTopSpeed, leftSpeed: initialLeftSpeed } = initialVelocities[i];
                const newTopSpeed = Math.abs(initialTopSpeed * speedMultiplier) * Math.sign(velocities[i].topSpeed);
                const newLeftSpeed = Math.abs(initialLeftSpeed * speedMultiplier) * Math.sign(velocities[i].leftSpeed);

                newVelocities.push({
                    topSpeed: newTopSpeed,
                    leftSpeed: newLeftSpeed,
                });
            }
            return newVelocities;
        });
    }, [speedMultiplier]);

    return {
        colors,
        positions,
        borderCollisions,
        setIsPaused,
        moveLogos,
        setShouldStopOnCollision,
    };
};
