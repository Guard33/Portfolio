import { useEffect, useRef } from "react";
import { startNightStreet } from "../nightStreet";

function NightStreet() {
  const canvasRef = useRef(null);

  useEffect(() => startNightStreet(canvasRef.current), []);

  return <canvas ref={canvasRef} className="intro-scene" aria-hidden="true" />;
}

export default NightStreet;
