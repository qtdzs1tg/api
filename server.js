const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const videosFolder = path.join(__dirname, 'api');

app.use(cors());

async function getRandomVideoFromFile(filename) {
  const filePath = path.join(videosFolder, filename);

  try {
    const data = await fs.promises.readFile(filePath, 'utf-8');
    const videos = JSON.parse(data);

    if (!Array.isArray(videos) || videos.length === 0) {
      throw new Error('Không có video hợp lệ trong file.');
    }

    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    return randomVideo;

  } catch (error) {
    throw new Error(`Lỗi khi đọc file ${filename}: ${error.message}`);
  }
}

app.get('/video-girl', async (req, res) => {
  try {
    const video = await getRandomVideoFromFile('vdgirl.json');
    const data = {
      author: 'qt',
      url: video
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 2));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/video-anime', async (req, res) => {
  try {
    const video = await getRandomVideoFromFile('vdanime.json');
    const data = {
      author: 'qt',
      url: video
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 2));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;