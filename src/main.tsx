import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Preload audio files
const receivedSound = new Audio("/media/received.mp3");
const sentSound = new Audio("/media/sent.mp3");
receivedSound.preload = "auto";
sentSound.preload = "auto";

createRoot(document.getElementById("root")!).render(<App />);
