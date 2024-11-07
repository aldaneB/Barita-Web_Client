import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Home from "./pages/home-view";
import { Routes, Route } from "react-router-dom";
import Filtered from "./pages/filtered-view";

//TODO:Install tailwind css and other packages

function App() {
  // const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/filtered" element={<Filtered />} />
    </Routes>
  );
}

export default App;
