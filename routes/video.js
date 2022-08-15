const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const rateLimit = require("axios-rate-limit");

const api = rateLimit(
  axios.create({
    baseURL: "https://oauth.reddit.com/r/unexpected",
    headers: {
      Authorization: `Bearer ${
        JSON.parse(
          fs.readFileSync(path.join(__dirname, `../upload/token.json`), "utf-8")
        ).access_token
      }`,
    },
  }),
  {
    maxRequests: 60,
  }
);

const getToken = async () => {
  return axios
    .post(
      "https://www.reddit.com/api/v1/access_token",
      "grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
        params: {
          scope: "read",
        },
      }
    )
    .then((r) => r.data);
};

const redditData = async (apiPath) => {
  return await api.get(apiPath, {
    params: {
      limit: 50,
    },
  });
};

// // get list of video
// router.get("/", (req, res) => {
//   res.status(200).json({ msg: "success", result: videos });
// });

// // make request for a particular video
// router.get("/:id/data", (req, res) => {
//   const data = videos.find((x) => x.slug === req.params.id);
//   res.status(200).json({ msg: "success", result: data });
// });

// //streaming route
// router.get("/:id", (req, res) => {
//   const videoPath = `assets/${req.params.id}.mp4`;
//   const videoStat = fs.statSync(videoPath);
//   const fileSize = videoStat.size;
//   const videoRange = req.headers.range;
//   if (videoRange) {
//     const parts = videoRange.replace(/bytes=/, "").split("-");
//     const start = parseInt(parts[0], 10);
//     const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
//     const chunksize = end - start + 1;
//     const file = fs.createReadStream(videoPath, { start, end });
//     const head = {
//       "Content-Range": `bytes ${start}-${end}/${fileSize}`,
//       "Accept-Ranges": "bytes",
//       "Content-Length": chunksize,
//       "Content-Type": "video/mp4",
//     };
//     res.writeHead(206, head);
//     file.pipe(res);
//   } else {
//     const head = {
//       "Content-Length": fileSize,
//       "Content-Type": "video/mp4",
//     };
//     res.writeHead(200, head);
//     fs.createReadStream(videoPath).pipe(res);
//   }
// });

// // captions route

// router.get("/:id/caption", (req, res) => {
//   res.sendFile(path.join(__dirname, `../assets/captions/${req.params.id}.vtt`));
// });

// router.get("/:id/movie", (req, res) => {
//   res.sendFile(path.join(__dirname, `../assets/${req.params.id}.mp4`));
// });

router.get("/reddit", (req, res) => {
  // getToken()
  //   .then((data) =>
  //     fs.writeFileSync(
  //       path.join(__dirname, `../upload/token.json`),
  //       JSON.stringify(data)
  //     )
  //   )
  //   .catch((error) => console.log(error));
  redditData("/")
    .then((data) => {
      console.log(data.data.data.children);
    })
    .catch((error) => console.log(error));
});
module.exports = router;
