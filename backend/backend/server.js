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
const path = require("path"); // ✅ Added for local yt-dlp path
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(cors({
  origin: "https://tublinx.onrender.com"  // ✅ Sirf apne frontend ko allow karo
}));
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
// // ✅ Video Info API (Fetch Available Formats - Duplicates & Quality Repeats Removed)
// app.get("/videoInfo", async (req, res) => {
//   const { url } = req.query;

//   if (!url || !url.startsWith("http")) {
//     return res.status(400).json({ error: "❌ Invalid YouTube URL" });
//   }

//   try {
//     // Get title + thumbnail from oEmbed
//     const { data: meta } = await axios.get(`https://www.youtube.com/oembed?url=${url}&format=json`);

//     // Get full video info via yt-dlp
//    const ytdlpPath = path.join(__dirname, "..", "bin", "yt-dlp"); // ✅ Go one level up

//     const ytdlProcess = spawn(ytdlpPath, ["-J", url]);
//     let jsonData = "";

//     ytdlProcess.stdout.on("data", (chunk) => {
//       jsonData += chunk;
//     });

//     ytdlProcess.stderr.on("data", (err) => {
//       console.error(`yt-dlp error: ${err}`);
//     });

//     ytdlProcess.on("close", (code) => {
//       if (code !== 0) {
//         return res.status(500).json({ error: "❌ yt-dlp failed to fetch video info" });
//       }

//       try {
//         const info = JSON.parse(jsonData);
//         const rawFormats = info.formats || [];

//         const processed = rawFormats
//           .filter((f) => (f.ext === "mp4" || f.ext === "m4a") && (f.vcodec !== "none" || f.acodec !== "none"))
//           .map((f) => ({
//             itag: f.format_id,
//             quality: f.format_note || `${f.height || "?"}p`,
//             type: f.vcodec === "none" ? "audio" : "video",
//             filesize: f.filesize ? formatBytes(f.filesize) : "Unknown",
//             resolution: f.resolution || `${f.width || "?"}x${f.height || "?"}`,
//           }));

//         // ✅ Remove duplicate quality entries (720p, 360p etc.)
//         const uniqueByQuality = [];
//         const seenQualities = new Set();

//         for (const format of processed) {
//           if (!seenQualities.has(format.quality)) {
//             seenQualities.add(format.quality);
//             uniqueByQuality.push(format);
//           }
//         }

//         // ✅ Sort: video before audio, then descending quality (e.g., 1080p > 720p)
//         uniqueByQuality.sort((a, b) => {
//           if (a.type !== b.type) return a.type === "video" ? -1 : 1;
//           return parseInt(b.quality) - parseInt(a.quality);
//         });

//         res.json({
//           title: meta.title,
//           thumbnail: `https://img.youtube.com/vi/${info.id}/hqdefault.jpg`,
//           formats: uniqueByQuality,
//         });
//       } catch (err) {
//         console.error("Parsing error:", err);
//         res.status(500).json({ error: "❌ Failed to parse yt-dlp output" });
//       }
//     });

//   } catch (error) {
//     console.error("API error:", error);
//     res.status(500).json({ error: "❌ Failed to fetch video metadata" });
//   }
// });

// // Helper function to format bytes
// function formatBytes(bytes) {
//   const sizes = ["B", "KB", "MB", "GB"];
//   if (bytes === 0) return "0 B";
//   const i = Math.floor(Math.log(bytes) / Math.log(1024));
//   return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
// }



// ✅ Video Info API (Fetch Available Formats)
app.get("/videoInfo", async (req, res) => {
  const { url } = req.query;

  if (!url || !url.startsWith("http")) {
    return res.status(400).json({ error: "❌ Invalid YouTube URL" });
  }

  const ytdlpPath = path.join(__dirname, "..", "bin", "yt-dlp"); // ✅ Go one level up

  try {
    // Step 1: oEmbed for title
    const { data: meta } = await axios.get(`https://www.youtube.com/oembed?url=${url}&format=json`);

    // Step 2: yt-dlp spawn
    const ytdlProcess = spawn(ytdlpPath, ["-J", url]);

    let jsonData = "";
    let errorData = "";

    ytdlProcess.stdout.on("data", (chunk) => {
      jsonData += chunk;
    });

    ytdlProcess.stderr.on("data", (err) => {
      errorData += err.toString();
    });

    ytdlProcess.on("close", (code) => {
      console.log("🔚 yt-dlp exited with code:", code);

      if (errorData) {
        console.error("❌ yt-dlp stderr:", errorData);
      }

      if (code !== 0 || !jsonData) {
        return res.status(500).json({ error: "❌ yt-dlp failed to fetch video info", details: errorData || "No output" });
      }

      try {
        console.log("📦 yt-dlp raw JSON length:", jsonData.length);

        const info = JSON.parse(jsonData);
        const rawFormats = info.formats || [];

        const processed = rawFormats
          .filter((f) => (f.ext === "mp4" || f.ext === "m4a") && (f.vcodec !== "none" || f.acodec !== "none"))
          .map((f) => ({
            itag: f.format_id,
            quality: f.format_note || `${f.height || "?"}p`,
            type: f.vcodec === "none" ? "audio" : "video",
            filesize: f.filesize ? formatBytes(f.filesize) : "Unknown",
            resolution: f.resolution || `${f.width || "?"}x${f.height || "?"}`,
          }));

        // Remove duplicates
        const uniqueByQuality = [];
        const seenQualities = new Set();
        for (const format of processed) {
          if (!seenQualities.has(format.quality)) {
            seenQualities.add(format.quality);
            uniqueByQuality.push(format);
          }
        }

        uniqueByQuality.sort((a, b) => {
          if (a.type !== b.type) return a.type === "video" ? -1 : 1;
          return parseInt(b.quality) - parseInt(a.quality);
        });

        const videoId = extractVideoId(url);

        res.json({
          title: meta.title,
          thumbnail: info.thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          formats: uniqueByQuality,
        });
      } catch (parseError) {
        console.error("❌ JSON Parse Error:", parseError);
        return res.status(500).json({ error: "❌ Failed to parse yt-dlp output" });
      }
    });
  } catch (apiError) {
    console.error("❌ External Meta API Error:", apiError);
    res.status(500).json({ error: "❌ Failed to fetch video metadata" });
  }
});



app.get("/download", async (req, res) => {
  const { url, itag } = req.query;

  if (!url || !itag) {
    return res.status(400).json({ error: "❌ Missing URL or itag parameter" });
  }

  console.log(`📥 Requesting download: ${url} | itag: ${itag}`);

  let ytdlpArgs = [];
  let contentType = "";
  let filename = "";

  // Auto-handle merging audio+video
  if (itag === "audio") {
    contentType = "audio/mp4";
    filename = `audio_${Date.now()}.m4a`;
    ytdlpArgs = [
      "-f", "bestaudio",
      "--extract-audio",
      "--audio-format", "m4a",
      "--audio-quality", "0",
      "-o", "-",
      url
    ];
  } else {
    contentType = "video/mp4";
    filename = `video_${Date.now()}.mp4`;
    ytdlpArgs = [
      "-f", `${itag}+bestaudio/best`,
      "--merge-output-format", "mp4",
      "-o", "-",
      url
    ];
  }

  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Connection", "keep-alive");

 const ytdlpPath = path.join(__dirname, "..", "bin", "yt-dlp"); // ✅ Go one level up

  const ytdl = spawn(ytdlpPath, ytdlpArgs);

  ytdl.stdout.pipe(res);

  ytdl.on("error", (err) => {
    console.error("❌ Failed to start yt-dlp:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "yt-dlp process failed", details: err.message });
    }
  });

  ytdl.on("close", (code) => {
    if (code === 0) {
      console.log("✅ yt-dlp finished successfully");
    } else {
      console.error(`❌ yt-dlp exited with code ${code}`);
    }
  });
});



app.listen(PORT, () => {
    console.log(`✅ Backend Server Running on port ${PORT} 🚀`);
});
