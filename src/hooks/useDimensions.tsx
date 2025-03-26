import React, { useEffect, useState } from "react";
import { LOGO_HEIGHT, LOGO_WIDTH } from "../constants";

interface Collision {
  horizontal: number;
  vertical: number;
}

export const useDimensions = (scale: number) => {
  const getRandomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
  };
  const getRandomColor = () => {
    const red = getRandomNumber(100, 256);
    const green = getRandomNumber(100, 256);
    const blue = getRandomNumber(100, 256);
    return `rgb(${red}, ${green}, ${blue})`;
  };

  const [top, setTop] = useState(0);
  const [left, setLeft] = useState(0);

  const [color, setColor] = useState(getRandomColor());

  const scaledWidth = LOGO_WIDTH * scale;
  const scaledHeight = LOGO_HEIGHT * scale;

  const [collision, setCollision] = useState<Collision>({
    horizontal: window.innerWidth - scaledWidth,
    vertical: window.innerHeight - scaledHeight,
  });

  const [topSpeed, setTopSpeed] = useState(1);
  const [leftSpeed, setLeftSpeed] = useState(2);

  const getDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    setCollision({
      horizontal: width - scaledWidth,
      vertical: height - scaledHeight,
    });
  };

  const moveLogo = () => {
    const newTop = top + topSpeed;
    const newLeft = left + leftSpeed;
    setTop(newTop);
    setLeft(newLeft);

    if (newTop >= collision.vertical) {
      setTopSpeed(-topSpeed);
      setColor(getRandomColor());
      setTop(collision.vertical);
    }
    if (newTop <= 0) {
      setTopSpeed(-topSpeed);
      setColor(getRandomColor());
      setTop(0);
    }
    if (newLeft >= collision.horizontal) {
      setLeftSpeed(-leftSpeed);
      setColor(getRandomColor());
      setLeft(collision.horizontal);
    }
    if (newLeft <= 0) {
      setLeftSpeed(-leftSpeed);
      setColor(getRandomColor());
      setLeft(0);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", getDimensions);

    return () => {
      window.removeEventListener("resize", getDimensions);
    };
  });

  useEffect(() => {
    setTimeout(() => {
      moveLogo();
    }, 16);
  });

  return { color, top, left };
};
