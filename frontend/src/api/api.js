// import axios from "axios";

// const API = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL });

// export const shortenUrl = async (originalUrl) => {
//     const response = await API.post("/shorten", { originalUrl });
//     return response.data; // ✅ Object Return कर रहे हैं
// };

// export const getVideoInfo = async (url) => {
//     console.log("📡 Fetching Video Info:", `${import.meta.env.VITE_BACKEND_URL}/videoInfo?url=${url}`);
//     return API.get(`/videoInfo?url=${url}`);
// };

// export const downloadVideo = (url, itag, audio = false) => {
//     window.location.href = `${import.meta.env.VITE_BACKEND_URL}/download?url=${encodeURIComponent(url)}&itag=${itag}&audio=${audio}`;
// };

import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_BACKEND_URL });

// ✅ URL Shortening API
export const shortenUrl = async (originalUrl) => {
    try {
        const response = await API.post("/shorten", { originalUrl });
        return response.data;
    } catch (error) {
        throw new Error("URL shortening failed.");
    }
};

// ✅ Fetch Video Info (No "Best Available" Option)
export const getVideoInfo = async (url) => {
    try {
        return await API.get(`/videoInfo?url=${encodeURIComponent(url)}`);
    } catch (error) {
        throw new Error("Failed to get video info.");
    }
};

// ✅ Download Video (Opens in New Tab)
export const downloadVideo = (url, itag) => {
    const downloadUrl = `${import.meta.env.VITE_BACKEND_URL}/download?url=${encodeURIComponent(url)}&itag=${itag}`;
    window.open(downloadUrl, "_blank");
};
