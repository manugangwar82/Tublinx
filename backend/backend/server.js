// const express = require("express");
// const cors = require("cors");
// const axios = require("axios");
// const shortid = require("shortid");
// const { exec } = require("child_process");
// require("dotenv").config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // ✅ CORS Middleware
// app.use(cors());
// app.use(express.json());

// const urlDatabase = {}; // URL Storage

// // 📌 ✅ Fix: पहले videoInfo API डालो
// app.get("/videoInfo", async (req, res) => {
//     console.log("🔍 Video Info API Hit:", req.query.url);
//     const { url } = req.query;
//     try {
//         const { data } = await axios.get(`https://www.youtube.com/oembed?url=${url}&format=json`);

//         let videoId = null;
//         if (url.includes("youtube.com/watch")) {
//             videoId = new URL(url).searchParams.get("v");  // Normal Video
//         } else if (url.includes("youtube.com/shorts/")) {
//             videoId = url.split("/shorts/")[1].split("?")[0];  // Shorts Video
//         }

//         if (!videoId) {
//             console.log("❌ Invalid YouTube URL:", url);
//             return res.status(400).json({ error: "Invalid YouTube URL" });
//         }

//         res.json({
//             title: data.title,
//             thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
//             formats: [
//                 { itag: 136, quality: "720p", type: "video" },
//                 { itag: 18, quality: "360p", type: "video" },
//                 { itag: 140, quality: "Audio", type: "audio" }
//             ]
//         });
//     } catch (error) {
//         console.log("❌ API Error:", error.message);
//         res.status(500).json({ error: "Invalid URL" });
//     }
// });

// // 📌 ✅ URL Shortener API
// app.post("/shorten", (req, res) => {
//     const { originalUrl } = req.body;
//     if (!originalUrl) {
//         return res.status(400).json({ error: "URL is required" });
//     }
//     const shortCode = shortid.generate();
//     urlDatabase[shortCode] = originalUrl;
//     res.json({ shortUrl: `http://localhost:${PORT}/${shortCode}` });
// });

// // 📌 ✅ Fix: Download API Add
// app.get("/download", (req, res) => {
//     let { url, quality, audio } = req.query;

//     if (!url) {
//         return res.status(400).json({ error: "Missing parameters" });
//     }

//     try {
//         const videoId = new URL(url).searchParams.get("v") || url.split("shorts/")[1]?.split("?")[0];
//         if (!videoId) {
//             return res.status(400).json({ error: "Invalid YouTube URL" });
//         }

//         let itag = 18; // Default 360p
//         if (quality === "720p") itag = 136;
//         if (audio === "true") itag = 140;

//         const format = audio === "true" ? "mp3" : "mp4";
//         const fileName = `download_${Date.now()}.${format}`;

//         console.log(`📥 Downloading: ${url}, Format: ${format}, Itag: ${itag}`);

//         exec(`yt-dlp -f ${itag} -o ${fileName} ${url}`, (error) => {
//             if (error) {
//                 console.error("❌ Download Error:", error);
//                 return res.status(500).json({ error: "Download failed", details: error.message });
//             }
//             res.download(fileName, (err) => {
//                 if (err) console.error("❌ File Download Error:", err);
//             });
//         });
//     } catch (err) {
//         console.error("❌ URL Parsing Error:", err);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });

// // 📌 ✅ Fix: Short URL Route को सबसे लास्ट में डालो
// app.get("/:shortCode", (req, res) => {
//     const originalUrl = urlDatabase[req.params.shortCode];
//     if (originalUrl) {
//         res.redirect(originalUrl);
//     } else {
//         res.status(404).json({ error: "Short URL not found" });
//     }
// });

// // ✅ Start Backend Server
// app.listen(PORT, () => console.log(`✅ Backend Server Running on port ${PORT} 🚀`));

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { spawn } = require("child_process");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const urlDatabase = {}; // URL Shortening Storage

// ✅ Extract Video ID (Supports Normal URLs, Shorts & Short Links)
function extractVideoId(url) {
  try {
    let videoId = null;

    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0]; // Short links
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("youtube.com/shorts/")[1].split("?")[0]; // Shorts
    } else {
      videoId = new URL(url).searchParams.get("v"); // Normal URLs
    }

    return videoId;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

// ✅ URL Shortening API
app.post("/shorten", (req, res) => {
  const { originalUrl } = req.body;
  if (!originalUrl || !originalUrl.startsWith("http")) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  const shortId = Math.random().toString(36).substring(7); // Generate short ID
  urlDatabase[shortId] = originalUrl;

  res.json({ shortUrl: `${req.protocol}://${req.get("host")}/s/${shortId}` });
});

// ✅ Redirect short URL to original URL
app.get("/s/:shortId", (req, res) => {
  const originalUrl = urlDatabase[req.params.shortId];
  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).json({ error: "Short URL not found" });
  }
});

// ✅ Video Info API (Fetch Available Formats - Best Removed)
app.get("/videoInfo", async (req, res) => {
  const { url } = req.query;
  if (!url || !url.startsWith("http")) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }
  try {
    const { data } = await axios.get(`https://www.youtube.com/oembed?url=${url}&format=json`);
    let videoId = extractVideoId(url);

    if (!videoId) {
      return res.status(400).json({ error: "Could not extract video ID" });
    }

    res.json({
      title: data.title,
      thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      formats: [
        { itag: "22", quality: "720p (MP4)", type: "video" },
        { itag: "18", quality: "360p (MP4)", type: "video" },
        { itag: "140", quality: "Audio (M4A)", type: "audio" }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching video info" });
  }
});

// ✅ Video Download API (Supports Shorts & Normal Links)
app.get("/download", async (req, res) => {
  const { url, itag } = req.query;
  if (!url || !itag) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  console.log(`📥 Downloading: ${url} (itag: ${itag})`);

  let ytdlpArgs = [];

  if (itag === "140") {
    res.setHeader("Content-Type", "audio/m4a");
    res.setHeader("Content-Disposition", `attachment; filename="audio_${Date.now()}.m4a"`);
    ytdlpArgs = ["-f", "140", "-o", "-", url];
  } else {
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Disposition", `attachment; filename="video_${Date.now()}.mp4"`);
    ytdlpArgs = [
      "-f", `${itag}/best`,
      "--embed-metadata",
      "--embed-subs",
      "--no-playlist",
      "-o", "-",
      url
    ];
  }

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Transfer-Encoding", "chunked");

  const ytdlProcess = spawn("yt-dlp", ytdlpArgs);

  ytdlProcess.stdout.pipe(res);

  ytdlProcess.stderr.on("data", (data) => {
    console.error(`yt-dlp Error: ${data}`);
  });

  ytdlProcess.on("error", (error) => {
    console.error("Process error:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Download failed", details: error.message });
    }
  });

  ytdlProcess.on("close", (code) => {
    console.log(`✅ Download finished with code ${code}`);
  });
});

app.listen(PORT, () => {
    console.log(`✅ Backend Server Running on port ${PORT} 🚀`);
});
