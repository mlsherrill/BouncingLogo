import "../App.css";
import { TP_ICON } from "../constants";

interface Props {
  width?: number;
  height?: number;
  color?: string;
  top?: number;
  left?: number;
  scale?: number;
  debug?: boolean;
}

export const TPIcon = ({
  color,
  top = 0,
  left = 0,
  scale = 2,
  debug = false,
}: Props) => {
  const scaledWidth = TP_ICON.width * scale;
  const scaledHeight = TP_ICON.height * scale;
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
      viewBox="0 0 25 24"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10.7432 0H15.3882L7.20747 18.6126H2.56246L10.7432 0ZM2.6613 5.3986H7.30631L4.64501 11.4546H0L2.6613 5.3986ZM14.0789 5.3986L5.9037 24.0001H10.5487L18.7239 5.3986H14.0789ZM15.4088 15.3619L20.4483 3.89625H25.0933L20.0538 15.3619H15.4088Z"
        fill={color}
      />
    </svg>
  );
};
