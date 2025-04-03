import "../App.css";
import { TH_ICON } from "../constants";

interface Props {
  width?: number;
  height?: number;
  color?: string;
  top?: number;
  left?: number;
  debug?: boolean;
}

export const THIcon = ({
  color,
  top = 0,
  left = 0,
  debug = false,
}: Props) => {
  const scaledWidth = TH_ICON.width * TH_ICON.scale;
  const scaledHeight = TH_ICON.height * TH_ICON.scale;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: scaledWidth,
        height: scaledHeight,
        top,
        left,
        border: debug ? "1px solid white" : "none",
      }}
      className="container"
      viewBox="0 0 48 48"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M47.015 0H32.4267L29.8883 14.4124C29.8545 14.6042 29.6889 14.7447 29.4941 14.7469L22.3114 14.8264C22.0578 14.8292 21.8642 14.6009 21.9081 14.3513L24.1945 1.36947C24.3203 0.654936 23.7707 0 23.0451 0H8.4544L0 48H15.0011C15.5682 48 16.0533 47.5929 16.1517 47.0345L18.7062 32.5317C18.7656 32.1942 18.6745 31.8477 18.4567 31.583L12.5815 24.4415C12.4365 24.2653 12.5618 24 12.79 24H34.7978C35.5244 24 36.0748 24.6559 35.9488 25.3715L34.9511 31.0342C34.8527 31.5928 34.3675 31.9999 33.8004 31.9999H27.1302C26.9338 31.9999 26.7655 32.141 26.7315 32.3345L23.9723 48H38.8586C39.4919 48 40.0338 47.5452 40.1437 46.9214L48.1664 1.37195C48.2925 0.656091 47.7418 0 47.015 0Z"
        fill={color}
      />
    </svg>
  );
};
