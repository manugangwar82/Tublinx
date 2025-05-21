import React from "react";
import "../Banner.css";
import bannerImage from "../assets/banner.webp"; // AI-generated image को सही path में रखें

const Banner = ({darkMode}) => {    
    return (
        <div className={`main-cont ${darkMode ? "dark-cont" : ""}`}>
            <div className={`banner-container ${darkMode ? "dark-banner-cont" : ""}`}>
                <div className="banner-image">
                    <img src={bannerImage} alt="FastDL Instagram Downloader" />
                </div>
                <div className={`banner-text ${darkMode ? "dark-banner-text" : ""}`}>
                    <h2 className={`banner-h2 ${darkMode ? "dark-banner-h2" : ""}`}>Youtube Videos and Shorts Download</h2>
                    <p className={`banner-p ${darkMode ? "dark-banner-p" : ""}`}>
                        Tublinx is an online web tool that helps you download Youtube Videos , Reels, and IGTV.
                        Tublinx is designed to be easy to use on any device, such as a mobile phone, tablet, or computer.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Banner;
