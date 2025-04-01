import { get } from "http";
import { useEffect, useState } from "react";

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

export const useDimensions = (
  icons: { width: number; height: number; scale: number }[]
) => {
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

  const [borderCollisions, setBorderCollisions] = useState(
    getBorderCollisions()
  );

  const [tops, setTops] = useState(() => {
    const tops: number[] = [];
    for (let i = 0; i < icons.length; i++) {
      tops.push(getRandomNumber(0, borderCollisions[i].vertical));
    }
    return tops;
  });
  const [lefts, setLefts] = useState(() => {
    const lefts: number[] = [];
    for (let i = 0; i < icons.length; i++) {
      lefts.push(getRandomNumber(0, borderCollisions[i].horizontal));
    }
    return lefts;
  });

  const getRandomTopSpeed = () => {
    const availableSpeeds = [-1, 1];
    const index = Math.floor(Math.random() * availableSpeeds.length);
    return availableSpeeds[index];
  };

  const getRandomLeftSpeed = () => {
    const availableSpeeds = [-2, 2];
    const index = Math.floor(Math.random() * availableSpeeds.length);
    return availableSpeeds[index];
  };
  const [topSpeeds, setTopSpeeds] = useState(() => {
    let topSpeeds: number[] = [];
    for (let i = 0; i < icons.length; i++) {
      topSpeeds.push(getRandomTopSpeed());
    }
    return topSpeeds;
  });
  const [leftSpeeds, setLeftSpeeds] = useState(() => {
    let leftSpeeds: number[] = [];
    for (let i = 0; i < icons.length; i++) {
      leftSpeeds.push(getRandomLeftSpeed());
    }
    return leftSpeeds;
  });
  const getDimensions = () => {
    setBorderCollisions(getBorderCollisions());
  };

  const moveLogos = () => {
    const newTops = [...tops];
    const newLefts = [...lefts];
    const newTopSpeeds = [...topSpeeds];
    const newLeftSpeeds = [...leftSpeeds];
    const newColors = [...colors];
    for (let i = 0; i < icons.length; i++) {
      for (let j = 0; j < icons.length; j++) {
        if (i === j) continue;
        const { top, left, topSpeed, leftSpeed, color } = moveLogo(i);
        newTops[i] = top;
        newLefts[i] = left;
        newTopSpeeds[i] = topSpeed;
        newLeftSpeeds[i] = leftSpeed;
        newColors[i] = color;

        // Check for collision with other logos
        const iconLocation: IconLocation = {
          top: newTops[i],
          left: newLefts[i],
          bottom: newTops[i] + scaledHeights[i],
          right: newLefts[i] + scaledWidths[i],
        };
        const otherIconLocation: IconLocation = {
          top: newTops[j],
          left: newLefts[j],
          bottom: newTops[j] + scaledHeights[j],
          right: newLefts[j] + scaledWidths[j],
        };
        if (
          iconLocation.top < otherIconLocation.bottom &&
          iconLocation.bottom > otherIconLocation.top &&
          iconLocation.left < otherIconLocation.right &&
          iconLocation.right > otherIconLocation.left
        ) {
          // determine the direction of the collision
          const deltaX = iconLocation.left - otherIconLocation.left;
          const deltaY = iconLocation.top - otherIconLocation.top;
          const absDeltaX = Math.abs(deltaX);
          const absDeltaY = Math.abs(deltaY);
          const isVerticalCollision = absDeltaY > absDeltaX;
          const isHorizontalCollision = absDeltaX > absDeltaY;
          if (isVerticalCollision) {
            newTopSpeeds[i] = -topSpeeds[i];
            newTopSpeeds[j] = -topSpeeds[j];
            newColors[i] = getRandomColor();
            newColors[j] = getRandomColor();
          }
          if (isHorizontalCollision) {
            newLeftSpeeds[i] = -leftSpeeds[i];
            newLeftSpeeds[j] = -leftSpeeds[j];
            newColors[i] = getRandomColor();
            newColors[j] = getRandomColor();
          }
        }
      }
    }
    setTops(newTops);
    setLefts(newLefts);
    setTopSpeeds(newTopSpeeds);
    setLeftSpeeds(newLeftSpeeds);
    setColors(newColors);
  };

  const moveLogo = (index: number) => {
    let newTop = tops[index] + topSpeeds[index];
    let newLeft = lefts[index] + leftSpeeds[index];
    let topSpeed = topSpeeds[index];
    let leftSpeed = leftSpeeds[index];
    let newColor = colors[index];

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
    window.addEventListener("resize", getDimensions);

    return () => {
      window.removeEventListener("resize", getDimensions);
    };
  });

  useEffect(() => {
    setTimeout(() => {
      moveLogos();
    }, 16);
  });

  return { colors, tops, lefts, borderCollisions };
};
