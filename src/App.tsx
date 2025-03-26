import React, { useEffect, useState } from "react";

import "./App.css";
import { THIcon } from "./components/THIcon";
import { useDimensions } from "./hooks/useDimensions";

function App() {
  const scale = 2;
  const { color, top, left } = useDimensions(scale);

  return (
    <div className="App">
      <THIcon scale={scale} color={color} top={top} left={left} />
    </div>
  );
}

export default App;
