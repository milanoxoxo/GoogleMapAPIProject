import { useState } from "react";
import GetLocation from "./components/getLocation";
import Home from "./components/home";

function App() {
  
  return (
    <div className="app">
      <GetLocation></GetLocation>
      <Home/>
    </div>
  );
}

export default App;
