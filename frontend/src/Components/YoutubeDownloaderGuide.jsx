import React from "react";
import "../YoutubeGuide.css"
import copyIcon from "../assets/s1.png"; // Copy link icon (replace with actual path)
import clickApp from "../assets/s2.png"; // Browser icon (replace with actual path)
import pasteIcon from "../assets/s3.png"; // Paste icon (replace with actual path)
import download from "../assets/s4.jpg"; // Paste icon (replace with actual path)

const YoutubeDownloaderGuide = ({ darkMode }) => {
    return (
        <div className={`guide-container ${darkMode ? "dark-guide-container" : ""}`}>
            <h2 className={`guide-title ${darkMode ? "dark-guide-title" : ""}`}>How to download Youtube video on PC and Mobile</h2>

            <div className={`step s1 ${darkMode ? "dark-step" : ""}`}>
                <div className="step-content">
                    <h3>1. <span>Copy the URL of Youtube</span></h3>
                    <p>
                        Open Youtube on your phone or computer, find the video you want to
                        download, click on the three dot button on the top right of the
                        video or the share button under the video then choose <b>“Copy Link”</b>.
                    </p>
                </div>
                <img src={copyIcon} alt="Copy Link" className="step-icon icon1" />
            </div>

            <div className={`step s2 ${darkMode ? "dark-step" : ""}`}>
                <img src={clickApp} alt="Open Snapinsta" className="step-icon icon2" />
                <div className="step-content">
                    <h3>2. <span>Open Tublinx™</span></h3>
                    <p>
                        Open <b>Tublinx™</b> in your preferred web browser. There’s no need
                        to install any software or extension.
                    </p>
                </div>
            </div>

            <div className={`step s3 ${darkMode ? "dark-step" : ""}`}>
                <div className="step-content">
                    <h3>3. <span>Paste the URL into Tublinx™</span></h3>
                    <p>
                        Paste the URL into <b>Tublinx™</b> and click the <b>download button</b> to start processing the video.
                    </p>
                </div>
                <img src={pasteIcon} alt="Paste URL" className="step-icon icon3" />
            </div>
            <div className={`step s4 ${darkMode ? "dark-step" : ""}`}>
            <img src={download} alt="Paste URL" className="step-icon icon4"/>
                <div className="step-content">
                    <h3>3. <span> Click the Download Button™</span></h3>
                    <p>
                       Once the video is processed, you’ll see it on the screen. Select the Download Video button. The video will be saved to your computer or mobile in seconds!
                    </p>
                </div>
                
            </div>
        </div>
    );
};

export default YoutubeDownloaderGuide;
