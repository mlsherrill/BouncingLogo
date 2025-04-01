import "./App.css";
import { THIcon } from "./components/THIcon";
import { TPIcon } from "./components/TPIcon";
import { TH_ICON, TP_ICON } from "./constants";
import { useDimensions } from "./hooks/useDimensions";
import { useQuery } from "./hooks/useQuery";

function App() {
  const query = useQuery();

  const icon = query.icon;

  const svgIcon = icon === "tp" ? TP_ICON : TH_ICON;
  const scale = 3;
  const { color, top, left } = useDimensions(scale, svgIcon);

  return (
    <div className="App">
      {icon === "tp" ? (
        <TPIcon scale={scale} color={color} top={top} left={left} />
      ) : (
        <THIcon scale={scale} color={color} top={top} left={left} />
      )}
    </div>
  );
}

export default App;
