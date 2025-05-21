import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import YoutubeDownloaderGuide from "./Components/YoutubeDownloaderGuide"
import Banner from "./Components/Banner"
import FaqSection from "./Components/FaqSection"
import Footer from "./Components/Footer";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    // console.log("Dark Mode:", darkMode); // ✅ Debugging
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      <Home darkMode={darkMode} />
      <Banner darkMode={darkMode}/>
      <YoutubeDownloaderGuide darkMode={darkMode}/>
      <FaqSection darkMode={darkMode}/>
      <Footer darkMode={darkMode}/>
      

    </div>
  );
}

export default App;
