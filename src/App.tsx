import "./App.css";
import { THIcon } from "./components/THIcon";
import { TPIcon } from "./components/TPIcon";
import { TH_ICON, TP_ICON } from "./constants";
import { useDimensions } from "./hooks/useDimensions";
import { useQuery } from "./hooks/useQuery";

function App() {
  const query = useQuery();
  const showDebug = query.debug === "true";
  const svgIcons = [TH_ICON, TP_ICON];
  const scales = [3, 6,];
  const { colors, tops, lefts, borderCollisions } = useDimensions(svgIcons);

  return (
    <div className="App">
      <THIcon scale={scales[0]} color={colors[0]} top={tops[0]} left={lefts[0]} debug={showDebug} />
      <TPIcon scale={scales[1]} color={colors[1]} top={tops[1]} left={lefts[1]} debug={showDebug}/>
      
      {showDebug && (
        <div style={{ position: "absolute", top: 0, left: 0 }}>
          <div>Window: {window.innerWidth} x {window.innerHeight}</div>
          <div>TH - Top: {tops[0]} Left: {lefts[0]}</div>
          <div>TH - Border Collision: {`{x: ${borderCollisions[0].horizontal}, y: ${borderCollisions[0].vertical}}`}</div>
          <div>THIcon width x height: {TH_ICON.width * scales[0]}x{TH_ICON.height * scales[0]}</div>
          <div>TP - Top: {tops[1]} Left: {lefts[1]}</div>
          <div>TP - Border Collision: {`{x: ${borderCollisions[1].horizontal}, y: ${borderCollisions[1].vertical}}`}</div>
          <div>TPIcon width x height: {TP_ICON.width * scales[1]}x{TP_ICON.height * scales[1]}</div>

          {/* <div>Color: {color}</div>
          <div>TPIcon Width: {TP_ICON.width * scale}</div>
          <div>TPIcon Height: {TP_ICON.height * scale}</div>
          <div>THIcon Top Speed: {1}</div>
          <div>THIcon Left Speed: {2}</div>
          <div>TPIcon Top Speed: {1}</div>
          <div>TPIcon Left Speed: {2}</div>
          <div>THIcon Border Collision: {`{ horizontal: ${window.innerWidth - TH_ICON.width * scale}, vertical: ${window.innerHeight - TH_ICON.height * scale} }`}</div>
          <div>TPIcon Border Collision: {`{ horizontal: ${window.innerWidth - TP_ICON.width * scale}, vertical: ${window.innerHeight - TP_ICON.height * scale} }`}</div>
          <div>Top Speeds: {`[${1}, ${1}]`}</div>
          <div>Left Speeds: {`[${2}, ${2}]`}</div>
          <div>Scaled Widths: {`[${TH_ICON.width * scale}, ${TP_ICON.width * scale}]`}</div>
          <div>Scaled Heights: {`[${TH_ICON.height * scale}, ${TP_ICON.height * scale}]`}</div> */}
        </div>
      )}
    </div>
  );
}

export default App;
