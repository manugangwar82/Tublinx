// import { useState } from "react";
// import { shortenUrl, getVideoInfo, downloadVideo } from "../api/api";
// import "../App.css";

// function Home({ darkMode }) {
//     const [url, setUrl] = useState("");
//     const [shortUrl, setShortUrl] = useState("");
//     const [videoInfo, setVideoInfo] = useState(null);

//     const handleShorten = async () => {
//         try {
//             const res = await shortenUrl(url);
//             setShortUrl(res.shortUrl);
//         } catch (error) {
//             console.error("Shorten Error:", error);
//         }
//     };

//     const handleGetVideoInfo = async () => {
//         try {
//             const res = await getVideoInfo(url);
//             setVideoInfo(res.data);
//         } catch (error) {
//             console.error("Video Info Error:", error);
//         }
//     };

//     return (
//         <div className={`homeCont ${darkMode ? "dark" : ""}`}>
//             <div className="app">
//                 <h1 className="title">🚀 YouTube Downloader & URL Shortener</h1>
//                 <p className="title2">Download Videos from Youtube</p>

//                 <div className="card">
//                     <input
//                         type="text"
//                         placeholder="Enter YouTube URL..."
//                         value={url}
//                         onChange={(e) => setUrl(e.target.value)}
//                         className="input"
//                     />
//                     <button onClick={handleShorten} className="btn">Shorten URL</button>
//                     {shortUrl && <p className="short-url">Short URL: <a href={shortUrl} target="_blank" rel="noopener noreferrer">{shortUrl}</a></p>}
//                 </div>

//                 <div className="card">
//                     <button onClick={handleGetVideoInfo} className="btn">Get Video Info</button>
//                     {videoInfo && (
//                         <div className="video-info">
//                             <h2>{videoInfo.title}</h2>
//                             <img src={videoInfo.thumbnail} alt="Thumbnail" className="thumbnail" />
//                             {videoInfo.formats?.map((format) => (
//                                 <button
//                                     key={format.itag}
//                                     onClick={() => downloadVideo(url, format.itag, format.type === "audio")}
//                                     className="btn download-btn"
//                                 >
//                                     Download {format.quality} ({format.type})
//                                 </button>
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default Home;

import { useState } from "react";
import { shortenUrl, getVideoInfo, downloadVideo } from "../api/api";
import "../App.css";

function Home({ darkMode }) {
    const [url, setUrl] = useState("");
    const [shortUrl, setShortUrl] = useState("");
    const [videoInfo, setVideoInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleShorten = async () => {
        if (!url.trim()) {
            setError("❌ Please enter a valid URL.");
            return;
        }
        setError("");
        try {
            setLoading(true);
            const res = await shortenUrl(url);
            setShortUrl(res.shortUrl);
        } catch (error) {
            setError("❌ Error shortening URL.");
        } finally {
            setLoading(false);
        }
    };

    const handleGetVideoInfo = async () => {
        if (!url.trim()) {
            setError("❌ Please enter a valid YouTube URL.");
            return;
        }
        setError("");
        try {
            setLoading(true);
            const res = await getVideoInfo(url);
            setVideoInfo(res.data);
        } catch (error) {
            setError("❌ Error fetching video info.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`homeCont ${darkMode ? "dark" : ""}`}>
            <div className="app">
                <h1 className="title">🚀 YouTube Downloader & URL Shortener</h1>
                <p className="title2">Download Videos from YouTube</p>

                {error && <p className="error-msg">{error}</p>}

                <div className="card">
                    <input
                        type="text"
                        placeholder="Enter YouTube URL..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="input"
                    />
                    <button onClick={handleShorten} className="btn" disabled={loading}>
                        {loading ? "Processing..." : "Shorten URL"}
                    </button>
                    {shortUrl && <p className="short-url">Short URL: <a href={shortUrl} target="_blank">{shortUrl}</a></p>}
                </div>

                <div className="card">
                    <button onClick={handleGetVideoInfo} className="btn" disabled={loading}>
                        {loading ? "Fetching..." : "Get Video Info"}
                    </button>
                    {videoInfo && (
                        <div className="video-info">
                            <h2>{videoInfo.title}</h2>
                            <img src={videoInfo.thumbnail} alt="Thumbnail" className="thumbnail" />
                            {videoInfo.formats?.map((format) => (
                                <button key={format.itag} onClick={() => downloadVideo(url, format.itag)} className="btn download-btn">
                                    Download {format.quality} ({format.type})
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;
