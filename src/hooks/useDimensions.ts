/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';

interface BorderCollision {
    horizontal: number;
    vertical: number;
}

class IconLocation {
    top: number;
    left: number;
    bottom: number;
    right: number;

    constructor(top: number, left: number, heigth: number, width: number) {
        this.top = top;
        this.left = left;
        this.bottom = top + heigth;
        this.right = left + width;
    }

    getHorizontalCollisionSide(otherIconLocation: IconLocation): string {
        const leftToRightDistance = Math.abs(this.left - otherIconLocation.right);
        const rightToLeftDistance = Math.abs(otherIconLocation.left - this.right);

        if (rightToLeftDistance < leftToRightDistance) {
            return 'right';
        }

        return 'left';
    }
    getVerticalCollisionSide(otherIconLocation: IconLocation): string {
        const topToBottomDistance = Math.abs(this.top - otherIconLocation.bottom);
        const bottomToTopDistance = Math.abs(otherIconLocation.top - this.bottom);

        if (bottomToTopDistance < topToBottomDistance) {
            return 'bottom';
        }

        return 'top';
    }
}

interface Velocity {
    topSpeed: number;
    leftSpeed: number;
}

type CollisionLog = {
    [key: string]: {
        IconLocation1: IconLocation;
        IconVelocity1: Velocity;
        IconLocation2: IconLocation;
        IconVelocity2: Velocity;
        CollisionType: string;
        CollisionFrame: number;
    }[];
};

const DEFAULT_TOP_SPEED = 1;
const DEFAULT_LEFT_SPEED = 2;

export const useDimensions = (
    icons: { width: number; height: number; scale: number }[],
    speedMultiplier: number,
    debug: boolean = false
) => {
    const [frameCount, setFrameCount] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [shouldStopOnCollision, setShouldStopOnCollision] = useState(false);
    const [initialVelocities, setInitialVelocities] = useState<Velocity[]>([]);
    const [iconCollisions, setIconCollisions] = useState<CollisionLog>({});

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

                const iconLocation: IconLocation = new IconLocation(
                    newPositions[i].top,
                    newPositions[i].left,
                    scaledHeights[i],
                    scaledWidths[i]
                );
                const otherIconLocation: IconLocation = new IconLocation(
                    newPositions[j].top,
                    newPositions[j].left,
                    scaledHeights[j],
                    scaledWidths[j]
                );

                const isCollision =
                    iconLocation.top < otherIconLocation.bottom &&
                    iconLocation.bottom > otherIconLocation.top &&
                    iconLocation.left < otherIconLocation.right &&
                    iconLocation.right > otherIconLocation.left;

                if (isCollision) {
                    if (shouldStopOnCollision) debugger;

                    const deltaX = iconLocation.left - otherIconLocation.left;
                    const deltaY = iconLocation.top - otherIconLocation.top;
                    const absDeltaX = Math.abs(deltaX);
                    const absDeltaY = Math.abs(deltaY);

                    const isVerticalCollision = absDeltaY > absDeltaX;
                    const isHorizontalCollision = absDeltaX > absDeltaY;
                    const shouldColorChange = isHorizontalCollision || isVerticalCollision;

                    setIconCollisions(prev => {
                        const newIconCollisions = { ...prev };
                        const collisionKey = `${Math.min(i, j)}-${Math.max(i, j)}`;
                        const lowerIndex = Math.min(i, j);

                        if (!newIconCollisions[collisionKey]) {
                            newIconCollisions[collisionKey] = [];
                        }

                        let iconLocation1: IconLocation;
                        let iconLocation2: IconLocation;
                        let iconVelocity1: Velocity;
                        let iconVelocity2: Velocity;
                        if (lowerIndex === i) {
                            iconLocation1 = iconLocation;
                            iconLocation2 = otherIconLocation;
                            iconVelocity1 = newVelocities[i];
                            iconVelocity2 = newVelocities[j];
                        } else {
                            iconLocation1 = otherIconLocation;
                            iconLocation2 = iconLocation;
                            iconVelocity1 = newVelocities[j];
                            iconVelocity2 = newVelocities[i];
                        }

                        newIconCollisions[collisionKey].push({
                            IconLocation1: iconLocation1,
                            IconVelocity1: iconVelocity1,
                            IconLocation2: iconLocation2,
                            IconVelocity2: iconVelocity2,
                            CollisionType: isVerticalCollision ? 'Vertical' : 'Horizontal',
                            CollisionFrame: frameCount,
                        });
                        return newIconCollisions;
                    });

                    if (isVerticalCollision) {
                        newVelocities[i].topSpeed = -newVelocities[i].topSpeed;
                        newVelocities[j].topSpeed = -newVelocities[j].topSpeed;
                        const sideOfCollision = iconLocation.getVerticalCollisionSide(otherIconLocation);
                        if (sideOfCollision === 'bottom') {
                            newPositions[i].top = otherIconLocation.top - scaledHeights[i];
                        } else {
                            newPositions[i].top = otherIconLocation.bottom;
                        }
                        if (Math.sign(newVelocities[i].topSpeed) === Math.sign(newVelocities[j].topSpeed)) {
                            newVelocities[j].topSpeed = -newVelocities[j].topSpeed;
                        }
                    }
                    if (isHorizontalCollision) {
                        newVelocities[i].leftSpeed = -newVelocities[i].leftSpeed;
                        newVelocities[j].leftSpeed = -newVelocities[j].leftSpeed;
                        const sideOfCollision = iconLocation.getHorizontalCollisionSide(otherIconLocation);
                        if (sideOfCollision === 'right') {
                            newPositions[i].left = otherIconLocation.left - scaledWidths[i];
                        } else {
                            newPositions[i].left = otherIconLocation.right;
                        }
                        if (Math.sign(newVelocities[i].leftSpeed) === Math.sign(newVelocities[j].leftSpeed)) {
                            newVelocities[j].leftSpeed = -newVelocities[j].leftSpeed;
                        }
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
            setFrameCount(prevFrameCount => prevFrameCount + 1);
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

    useEffect(() => {
        for (const key in iconCollisions) {
            const collisionData = iconCollisions[key];
            if (collisionData.length > 10) {
                console.log(`More than 10 collisions detected between icons ${key}:`, collisionData);
            }
        }
    }, [iconCollisions]);

    useEffect(() => {
        if (frameCount % 120 === 0) {
            setIconCollisions({});
            return;
        }
    }, [frameCount]);

    useEffect(() => {
        if (icons.length < colors.length) {
            const newColors = [...colors];
            const newPositions = [...positions];
            const newVelocities = [...velocities];
            const newBorderCollisions = [...borderCollisions];
            const newInitialVelocities = [...initialVelocities];
            newColors.splice(icons.length);
            newVelocities.splice(icons.length);
            newPositions.splice(icons.length);
            newBorderCollisions.splice(icons.length);
            newInitialVelocities.splice(icons.length);
            setVelocities(newVelocities);
            setPositions(newPositions);
            setBorderCollisions(newBorderCollisions);
            setInitialVelocities(newInitialVelocities);
            setColors(newColors);
        }
    }, [icons]);

    return {
        colors,
        positions,
        borderCollisions,
        setIsPaused,
        moveLogos,
        setShouldStopOnCollision,
    };
};
